// tables.type.d.ts
export type orgType = {
    org_code: string;
    org_name: string;
    is_active: boolean;
}

export type userType = {
    org_code: string;
    user_id: string;
    username: string;
    password?: string;
    role: string;
    is_active: boolean;
}

export type productType = {
    org_code: string;
    prod_id: string;
    prod_name: string;
    prod_type: string;
    uom: string;
    brand?: string;
    category?: string;
    bar_qr_code?: string;
}

export type purchaseMasterType = {
    org_code: string;
    pur_id: string;
    pur_date: Date;
    supp_id: string;
    total_amt: number;
    discount?: number;
    vat?: number;
    paid_amt: number;
}

export type purchaseDetailType = {
    org_code: string;
    pur_id: string;
    pur_date: Date;
    prod_id: string;
    uom: string;
    qty: number;
    unit_price: number;
}

export type salesMasterType = {
    org_code: string;
    sales_id: string;
    sales_date: Date;
    cust_id: string;
    total_amt: number;
    discount?: number;
    vat?: number;
    paid_amt: number;
}

export type salesDetailType = {
    org_code: string;
    sales_id: string;
    sales_date: Date;
    prod_id: string;
    uom: string;
    qty: number;
    unit_price: number;
}

export type supplierType = {
    org_code: string;
    supp_id: string;
    supp_name: string;
    address?: string;
    phone?: string;
    email?: string;
    // Other fields can be added here
}

export type customerType = {
    org_code: string;
    cust_id: string;
    cust_name: string;
    address?: string;
    phone?: string;
    email?: string;
    // Other fields can be added here
}
