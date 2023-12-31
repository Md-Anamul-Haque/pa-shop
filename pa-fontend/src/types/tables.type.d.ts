import { stockType } from "./stock";

// tables.type.d.ts
export type orgType = {
    org_code: string;
    org_name: string;
    is_active: boolean;
}

export type userType = {
    org_code?: string;
    first_name?: string;
    last_name?: string;
    user_id?: string;
    email?: string;
    password?: string;
    role?: string;
    is_active?: boolean;
}

export type productType = {
    prod_id?: string;
    prod_name: string;
    prod_type: string;
    price: number;
    uom: string;
    brand?: string;
    category?: string;
    bar_qr_code?: string;
    created_at?: Date;
    updated_at?: Date;
}

export type purchaseMasterType = {
    pur_id?: string;
    pur_date?: string;
    supp_id?: string;
    discount?: number | string;
    vat?: number | string;
    paid_amt?: number | string;
}

export type purchaseDetailType = {
    prod_name?: string;
    pur_id?: string;
    pur_dt_id?: number;
    prod_id: string;
    uom: string;
    qty: number | string;
    unit_price: number | string;
}
export type purchaseReturnMasterType = {
    pur_r_date?: string;
    supp_id?: string;
    discount?: number | string;
    vat?: number | string;
    paid_amt?: number | string;
    remark?: string
}

export type purchaseReturnDetailType = {
    // org_code: string;
    // pur_r_id: string;
    // pur_r_dt_id?: number;
    prod_name?: string;
    prod_id: string;
    uom: string | string;
    qty: number | string;
    unit_price: number | string;

    stocProduct?: stockType;
}

export type salesMasterType = {
    sales_id?: string;
    sales_date?: string;
    cust_id?: string;
    discount?: number | string;
    vat?: number | string;
    paid_amt?: number | string;
}

export type salesDetailType = {
    // sales_id: string;
    prod_name?: string;
    sales_dt_id?: number;
    prod_id: string;
    uom: string;
    qty: number | string;
    unit_price: number | string;

    // extra data for handle sales page of fontend
    stocProduct?: stockType;
}
export type salesReturnMasterType = {
    // org_code: string;
    // sales_r_id: string;
    sales_r_date?: string;
    cust_id?: string;
    discount?: number | string;
    vat?: number | string;
    paid_amt?: string | number;
    remark?: string;
}

export type salesReturnDetailType = {
    // sales_r_dt_id?: number;
    sales_r_id?: string;
    prod_id: string;
    prod_name?: string;
    uom?: string;
    qty?: number | string;
    unit_price?: number | string;
}
export type supplierType = {
    org_code?: string;
    supp_id?: string;
    supp_name: string;
    address?: string;
    phone?: string;
    email?: string;
    created_at?: Date;
    updated_at?: Date;
}

export type customerType = {
    org_code?: string;
    cust_id?: string;
    cust_name: string;
    address?: string;
    phone?: string;
    email?: string;
    created_at?: Date;
    updated_at?: Date;
}

type userSessionType = {
    org_code: string;
    session_id: string; // Assuming UUIDs are represented as strings
    user_id: string;
    jwt_token: string;
    tokenClient: string;
    created_at: Date; // Assuming the timestamp is represented as a JavaScript Date object
    expires_at: Date;
};
