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
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    -- username VARCHAR(255) unique NOT NULL,
    email VARCHAR(255) unique NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true, -- Adding is_active field with default value true
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);





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


-- Purchase Master Table
CREATE TABLE purchase_mt (
    org_code VARCHAR(50),
    pur_id VARCHAR(50),
    pur_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    supp_id VARCHAR(50),
    discount DECIMAL(5, 2),
    vat DECIMAL(5, 2),
    paid_amt DECIMAL(10, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(org_code,pur_id), -- Composite primary key
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (org_code, supp_id) REFERENCES supplier(org_code, supp_id)
);

-- Purchase Detail Table
CREATE TABLE purchase_dt (
    org_code VARCHAR(50),
    pur_dt_id BIGSERIAL PRIMARY KEY,
    pur_id VARCHAR(50),
    -- pur_date DATE,
    prod_id VARCHAR(50),
    -- uom VARCHAR(50) NOT NULL,
    qty INT,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (pur_id,org_code) REFERENCES purchase_mt(pur_id,org_code),
    FOREIGN KEY (prod_id,org_code) REFERENCES product(prod_id,org_code)
);

-- purchase_return Master Table
CREATE TABLE purchase_return_mt (
    org_code VARCHAR(50),
    pur_r_id VARCHAR(50),
    pur_r_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    supp_id VARCHAR(50),
    discount DECIMAL(5, 2),
    vat DECIMAL(5, 2),
    paid_amt DECIMAL(10, 2),
    remark VARCHAR(250),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(org_code,pur_r_id), -- Composite primary key
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (org_code, supp_id) REFERENCES supplier(org_code, supp_id)
);

-- purchase_return Detail Table
CREATE TABLE purchase_return_dt (
    org_code VARCHAR(50),
    pur_r_dt_id BIGSERIAL PRIMARY KEY,
    pur_r_id VARCHAR(50),
    prod_id VARCHAR(50),
    uom VARCHAR(50) NOT NULL,
    qty INT,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (pur_r_id,org_code) REFERENCES purchase_return_mt(pur_r_id,org_code),
    FOREIGN KEY (prod_id,org_code) REFERENCES product(prod_id,org_code)
);


-- Sales Master Table
CREATE TABLE sales_mt (
    org_code VARCHAR(50),
    sales_id VARCHAR(50),
    sales_date DATE NOT NULL,
    cust_id VARCHAR(50),
    discount DECIMAL(5, 2),
    vat DECIMAL(5, 2),
    paid_amt DECIMAL(10, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(org_code,sales_id), -- Composite primary key
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);

-- Sales Detail Table
CREATE TABLE sales_dt (
    org_code VARCHAR(50),
    sales_dt_id BIGSERIAL PRIMARY KEY,
    sales_id VARCHAR(50),
    -- sales_date DATE,
    prod_id VARCHAR(50),
    uom VARCHAR(50) NOT NULL,
    qty INT,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (sales_id,org_code) REFERENCES sales_mt(sales_id,org_code),
    FOREIGN KEY (prod_id,org_code) REFERENCES product(prod_id,org_code)
);

-- Sales return Master Table
CREATE TABLE sales_return_mt (
    org_code VARCHAR(50),
    sales_r_id VARCHAR(50),
    sales_r_date DATE NOT NULL,
    cust_id VARCHAR(50),
    discount DECIMAL(5, 2),
    vat DECIMAL(5, 2),
    paid_amt DECIMAL(10, 2),
    remark VARCHAR(250),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(org_code,sales_r_id), -- Composite primary key
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);

-- Sales return Detail Table
CREATE TABLE sales_return_dt (
    org_code VARCHAR(50),
    sales_r_dt_id BIGSERIAL PRIMARY KEY,
    sales_r_id VARCHAR(50),
    prod_id VARCHAR(50),
    uom VARCHAR(50) NOT NULL,
    qty INT,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (sales_r_id,org_code) REFERENCES sales_return_mt(sales_r_id,org_code),
    FOREIGN KEY (prod_id,org_code) REFERENCES product(prod_id,org_code)
);


CREATE TABLE user_session (
    org_code VARCHAR(50),
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Primary key column with UUID data type
    user_id UUID,
    token TEXT,
    tokenClient VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP +  '1 day', -- Automatically expire documents after 24 hours
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);



CREATE TABLE sales_dt_track (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Primary key column with UUID data type
    org_code VARCHAR(50),
    prod_id VARCHAR(50),
    qty int,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (prod_id,org_code) REFERENCES product(prod_id,org_code)
);
-- INSERT INTO sales_dt_track (org_code,prod_id,qty) VALUES ('org_1','PROD_1',10);
CREATE TABLE pur_dt_track (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Primary key column with UUID data type
    org_code VARCHAR(50),
    prod_id VARCHAR(50),
    qty int,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (prod_id,org_code) REFERENCES product(prod_id,org_code)

);
