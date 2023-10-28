-- Org Table
CREATE TABLE org (
    org_code VARCHAR(50) PRIMARY KEY,
    org_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL
);
-- User Table
CREATE TABLE user (
    org_code VARCHAR(50),
    user_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true, -- Adding is_active field with default value true
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);
-- Product Table
CREATE TABLE product (
    org_code VARCHAR(50),
    prod_id VARCHAR(50) PRIMARY KEY,
    prod_name VARCHAR(255) NOT NULL,
    prod_type VARCHAR(255) NOT NULL,
    uom VARCHAR(50) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(255),
    bar_qr_code VARCHAR(255),
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);

-- Purchase Master Table
CREATE TABLE purchase_mt (
    org_code VARCHAR(50),
    pur_id VARCHAR(50) PRIMARY KEY,
    pur_date DATE NOT NULL,
    supp_id VARCHAR(50),
    total_amt DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2),
    vat DECIMAL(5, 2),
    paid_amt DECIMAL(10, 2),
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);

-- Purchase Detail Table
CREATE TABLE purchase_dt (
    org_code VARCHAR(50),
    pur_id VARCHAR(50),
    pur_date DATE,
    prod_id VARCHAR(50),
    uom VARCHAR(50) NOT NULL,
    qty INT,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (org_code) REFERENCES org(org_code),
    FOREIGN KEY (pur_id) REFERENCES purchase_mt(pur_id),
    FOREIGN KEY (prod_id) REFERENCES product(prod_id)
);

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
    supp_id VARCHAR(50) PRIMARY KEY,
    supp_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    -- Other columns like etc.... can be added here
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);

-- Customer Table
CREATE TABLE customer (
    org_code VARCHAR(50),
    cust_id VARCHAR(50) PRIMARY KEY,
    cust_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    -- Other columns like etc.... can be added here
    FOREIGN KEY (org_code) REFERENCES org(org_code)
);
