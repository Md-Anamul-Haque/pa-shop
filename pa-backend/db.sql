-- Org Table
-- insert into org (org_code,org_name,is_active) values((SELECT 'org_' || COALESCE(MAX(CAST(SPLIT_PART(org_code, '_', 2) AS INTEGER)), 0)+1 FROM org),...,...)
CREATE TABLE org (
    org_code VARCHAR(50) PRIMARY KEY,
    org_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL
);
-- USERS Table
CREATE TABLE USERS(
    org_code VARCHAR(50),
    user_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true, -- Adding is_active field with default value true
    FOREIGN KEY (org_code) REFERENCES org(org_code)
)
-- Product Table
-- (SELECT COALESCE(MAX(CAST(SPLIT_PART(prod_id, '_', 2) AS INTEGER)), 0)+1 FROM product);

CREATE TABLE product (
    org_code VARCHAR(50),
    prod_id VARCHAR(50),
    prod_name VARCHAR(255) NOT NULL,
    prod_type VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    uom VARCHAR(50) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(255),
    bar_qr_code VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (org_code, prod_id), -- Composite primary key
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);



-- Purchase Master Table
CREATE TABLE purchase_mt (
    org_code VARCHAR(50),
    pur_id SERIAL PRIMARY KEY,
    pur_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    supp_id VARCHAR(50),
    total_amt DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2),
    vat DECIMAL(5, 2),
    paid_amt DECIMAL(10, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);

-- Purchase Detail Table
CREATE TABLE purchase_dt (
    org_code VARCHAR(50),
    pur_dt_id BIGSERIAL PRIMARY KEY,
    pur_id INTEGER,
    pur_date DATE,
    prod_id VARCHAR(50),
    uom VARCHAR(50) NOT NULL,
    qty INT,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (pur_id) REFERENCES purchase_mt(pur_id),
    FOREIGN KEY (prod_id,org_code) REFERENCES product(prod_id,org_code)
);
-- CREATE OR REPLACE FUNCTION insert_purchase_dt(
--     p_org_codes VARCHAR[],
--     p_pur_ids INTEGER[],
--     p_pur_dates DATE[],
--     p_prod_ids VARCHAR[],
--     p_uoms VARCHAR[],
--     p_qtys INT[],
--     p_unit_prices DECIMAL[]
-- ) RETURNS VOID AS $$
-- DECLARE
--     i INT;
-- BEGIN
--     -- Start a transaction
--     BEGIN
--         -- Loop through the arrays and insert records
--         FOR i IN 1..array_length(p_org_codes, 1) LOOP
--             -- Insert into purchase_dt
--             INSERT INTO purchase_dt(org_code, pur_id, pur_date, prod_id, uom, qty, unit_price, created_at, updated_at)
--             VALUES (p_org_codes[i], p_pur_ids[i], p_pur_dates[i], p_prod_ids[i], p_uoms[i], p_qtys[i], p_unit_prices[i], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
--         END LOOP;

--         -- Commit the transaction
--         COMMIT;
--     EXCEPTION
--         -- Rollback the transaction in case of error
--         WHEN OTHERS THEN
--             ROLLBACK;
--             RAISE;
--     END;
-- END;
-- $$ LANGUAGE plpgsql;


-- Sales Master Table
CREATE TABLE sales_mt (
    org_code VARCHAR(50),
    sales_id VARCHAR(50) PRIMARY KEY,
    sales_date DATE NOT NULL,
    cust_id VARCHAR(50),
    total_amt DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2),
    vat DECIMAL(5, 2),
    paid_amt DECIMAL(10, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (org_code) REFERENCES org(org_code)
);

-- Sales Detail Table
CREATE TABLE sales_dt (
    org_code VARCHAR(50),
    sales_id VARCHAR(50),
    sales_date DATE,
    prod_id VARCHAR(50),
    uom VARCHAR(50) NOT NULL,
    qty INT,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (sales_id) REFERENCES sales_mt(sales_id),
    FOREIGN KEY (prod_id) REFERENCES product(prod_id)
);

-- Supplier Table
CREATE TABLE supplier (
    org_code VARCHAR(50),
    supp_id VARCHAR(50),
    supp_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (org_code, supp_id),
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);


-- Customer Table
CREATE TABLE customer (
    org_code VARCHAR(50),
    cust_id VARCHAR(50),
    cust_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (org_code, cust_id),
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);




