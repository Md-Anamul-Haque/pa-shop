
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();
-- uuid_generate_v4           
-- ------------------------------------
--  579fc6f0-21c8-44ae-8015-fc0fbc33ec5d
-- (1 row)


-- -------------
CREATE OR REPLACE VIEW stock_vw AS
select v.org_code, v.prod_id, p.prod_name, v.qty, p.bar_qr_code ,p.prod_type, p.brand, p.category, p.price, p.uom 
from(
SELECT org_code, prod_id, SUM(
    CASE 
        WHEN source IN ('purchase', 'sales_return', 'pur_track') THEN COALESCE(qty, 0)
        WHEN source IN ('sales', 'purchase_return', 'sales_track') THEN -COALESCE(qty, 0)
    END
) AS qty
FROM (
    SELECT org_code, prod_id, SUM(COALESCE(qty, 0)) AS qty, 'purchase' as source
    FROM purchase_dt
    GROUP BY org_code, prod_id

    UNION

    SELECT org_code, prod_id, SUM(COALESCE(qty, 0)) AS qty, 'sales' as source
    FROM sales_dt
    GROUP BY org_code, prod_id

    UNION ALL

    SELECT org_code, prod_id, SUM(COALESCE(qty, 0)) AS qty, 'pur_track' as source
    FROM pur_dt_track
    GROUP BY org_code, prod_id

    UNION

    SELECT org_code, prod_id, SUM(COALESCE(qty, 0)) AS qty, 'sales_track' as source
    FROM sales_dt_track
    GROUP BY org_code, prod_id

    UNION

    SELECT org_code, prod_id, SUM(COALESCE(qty, 0)) AS qty, 'purchase_return' as source
    FROM purchase_return_dt
    GROUP BY org_code, prod_id

    UNION

    SELECT org_code, prod_id, SUM(COALESCE(qty, 0)) AS qty, 'sales_return' as source
    FROM sales_return_dt
    GROUP BY org_code, prod_id
)
GROUP BY org_code, prod_id
) v , product p
where v.org_code = p.org_code
and v.prod_id = p.prod_id;
-- ---------------------







SELECT p.prod_name, p.uom, s.qty 
FROM product p
LEFT JOIN stock_vw s ON p.org_code = s.org_code AND p.prod_id = s.prod_id;





-- -----------------------------------------------------------------------------------------------------------

-- Create a composite type to represent the structure of sales_dt array elements
CREATE TYPE sales_dt_insert_type AS (
    prod_id VARCHAR(50),
    qty INT,
    uom VARCHAR(50),
    unit_price DECIMAL(10, 2)
);


-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS insert_sales_transaction(character varying, date, character varying, numeric, numeric, numeric, sales_dt_insert_type[]);

-- Create a composite type to represent the structure of sales_dt array elements
CREATE TYPE sales_dt_insert_type AS (
    prod_id VARCHAR(50),
    qty INT,
    uom VARCHAR(50),
    unit_price DECIMAL(10, 2)
);

-- Create the PL/pgSQL function
CREATE OR REPLACE FUNCTION insert_sales_transaction(
    p_org_code VARCHAR(50),
    p_sales_date DATE,
    p_cust_id VARCHAR(50),
    p_discount DECIMAL(5, 2),
    p_vat DECIMAL(5, 2),
    p_paid_amt DECIMAL(10, 2),
    p_prod_list sales_dt_insert_type[]
) RETURNS TABLE (
    sales_id VARCHAR(50),
    sales_date DATE,
    cust_id VARCHAR(50),
    discount DECIMAL(5, 2),
    vat DECIMAL(5, 2),
    paid_amt DECIMAL(10, 2)
) AS $$
DECLARE
    v_sales_id VARCHAR(50);
BEGIN
    -- Start a transaction
    BEGIN
        -- Insert into sales_mt
        INSERT INTO sales_mt (org_code, sales_date, cust_id, discount, vat, paid_amt, sales_id)
        VALUES (
            p_org_code,
            p_sales_date,
            p_cust_id,
            p_discount,
            p_vat,
            p_paid_amt,
            (
                SELECT 
                    CASE 
                        WHEN COUNT(*) = 0 OR MAX(CASE WHEN org_code = p_org_code THEN 1 ELSE 0 END) = 0 
                        THEN 'SAL_1'
                        ELSE 'SAL_' || (COALESCE(
                            MAX(CAST(SPLIT_PART(sales_id, '_', 2) AS INTEGER)), 0) + 1)::TEXT
                    END
                FROM sales_mt
                WHERE org_code = p_org_code
            )
        )
        RETURNING * INTO v_sales_id;

        -- Loop through the product list and insert into sales_dt
        FOR i IN 1..array_length(p_prod_list, 1)
        LOOP
            -- Check if the quantity is available
            IF NOT EXISTS (
                SELECT 1
                FROM stock_vw
                WHERE org_code = p_org_code AND prod_id = p_prod_list[i].prod_id AND qty >= p_prod_list[i].qty
            ) THEN
                -- Rollback if quantity not available
                RAISE EXCEPTION 'Insufficient quantity for product %', p_prod_list[i].prod_id;
            END IF;

            -- Insert into sales_dt
            INSERT INTO sales_dt (org_code, sales_id, prod_id, uom, qty, unit_price)
            VALUES (p_org_code, v_sales_id, p_prod_list[i].prod_id, p_prod_list[i].uom, p_prod_list[i].qty, p_prod_list[i].unit_price);
        END LOOP;

    EXCEPTION
        WHEN OTHERS THEN
            -- Rollback on any exception and return the error message
            ROLLBACK;
            RAISE;
    END;

    -- Commit the transaction if everything is successful
    COMMIT;

    -- Return the inserted row from sales_mt
    RETURN QUERY SELECT * FROM sales_mt WHERE sales_id = v_sales_id;
END;
$$ LANGUAGE plpgsql;

