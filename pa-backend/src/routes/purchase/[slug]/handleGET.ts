import { pool, sql } from "@/config/db";
import { ResponseHandler } from "@/helpers/ResponseHandler";
import { Request, Response } from "@/types/request&responce.type";
export const handlePurchaseGET = async (req: Request, res: Response) => {
  try {
    // ... handle GET logic start hear
    const pur_id = req.params.slug.toUpperCase();
    const org_code = req.auth?.user?.org_code as string;
    console.log({ org_code });
    const result = await pool.query(`
  SELECT
    jsonb_build_object(
      'supplier', jsonb_build_object(
        'supp_id', s.supp_id,
        'supp_name', s.supp_name,
        'address', s.address,
        'phone', s.phone,
        'email', s.email,
        'created_at', s.created_at,
        'updated_at', s.updated_at
      ),
      'dts', COALESCE(jsonb_agg(jsonb_build_object(
        'pur_dt_id', dt.pur_dt_id,
        'pur_id', dt.pur_id,
        'prod_id', dt.prod_id,
        'prod_name', p.prod_name,
        'uom', p.uom,
        'qty', dt.qty,
        'unit_price', dt.unit_price
        -- Add other dt columns as needed
      )), '[]'::jsonb),
      'mt', jsonb_build_object(
        'org_code', mt.org_code,
        'pur_id', mt.pur_id,
        'pur_date', mt.pur_date,
        'supp_id', mt.supp_id,
        'discount', mt.discount,
        'vat', mt.vat,
        'paid_amt', mt.paid_amt,
        'created_at', mt.created_at,
        'updated_at', mt.updated_at
      )
    ) AS result
  FROM
    purchase_mt mt
  LEFT JOIN
    purchase_dt dt ON mt.pur_id = dt.pur_id AND mt.org_code = dt.org_code
  LEFT JOIN
    supplier s ON mt.supp_id = s.supp_id AND mt.org_code = s.org_code
  LEFT JOIN
    product p ON dt.prod_id = p.prod_id AND dt.org_code = p.org_code
  WHERE
    mt.pur_id = $1
    AND mt.org_code = $2
  GROUP BY
    mt.org_code, mt.pur_id, s.supp_id, s.supp_name, s.address, s.phone, s.email, s.created_at, s.updated_at;
`,[pur_id,org_code]);
console.log({org_code})

// console.log(result.rows[0].result);

  
  console.log(result.rows[0].result);
      // const supplier=await sql`SELECT * FROM supplier WHERE supp_id = ${mtData[0].supp_id} AND org_code = ${org_code}`;
    if (result.rows[0].result) {
      return ResponseHandler(res, {
        resType: "success",
        status: "OK",
        payload: result.rows[0].result, // your can any data for responce
      });
    } else {
      return ResponseHandler(res, {
        resType: "error",
        status: "OK",
        message: "not found",
      });
    }
  } catch (error) {
    return ResponseHandler(res, {
      resType: "error",
      status: "INTERNAL_SERVER_ERROR",
      message: (error as any)?.message || "", //your can any message
    });
  }
};
