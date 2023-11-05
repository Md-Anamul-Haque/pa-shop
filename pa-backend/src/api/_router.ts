//rg-express
 import { Router } from 'express'; 
 const router = Router()
            
            
import * as src_api_auth_login_route_ts from './auth/login/route';
import * as src_api_customer__slug__route_ts from './customer/[slug]/route';
import * as src_api_customer_route_ts from './customer/route';
import * as src_api_org_route_ts from './org/route';
import * as src_api_product__slug__route_ts from './product/[slug]/route';
import * as src_api_product_route_ts from './product/route';
import * as src_api_purchase__slug__route_ts from './purchase/[slug]/route';
import * as src_api_purchase_route_ts from './purchase/route';
import * as src_api_sales__slug__route_ts from './sales/[slug]/route';
import * as src_api_sales_route_ts from './sales/route';
import * as src_api_supplier__slug__route_ts from './supplier/[slug]/route';
import * as src_api_supplier_route_ts from './supplier/route';
import * as src_api_user_route_ts from './user/route';



router.get('/auth/login', src_api_auth_login_route_ts.GET);
router.get('/customer/:slug', src_api_customer__slug__route_ts.GET);
router.put('/customer/:slug', src_api_customer__slug__route_ts.PUT);
router.get('/customer', src_api_customer_route_ts.GET);
router.get('/org', src_api_org_route_ts.GET);
router.post('/org', src_api_org_route_ts.POST);
router.get('/product/:slug', src_api_product__slug__route_ts.GET);
router.put('/product/:slug', src_api_product__slug__route_ts.PUT);
router.get('/product', src_api_product_route_ts.GET);
router.post('/product', src_api_product_route_ts.POST);
router.get('/purchase/:slug', src_api_purchase__slug__route_ts.GET);
router.put('/purchase/:slug', src_api_purchase__slug__route_ts.PUT);
router.get('/purchase', src_api_purchase_route_ts.GET);
router.post('/purchase', src_api_purchase_route_ts.POST);
router.get('/sales/:slug', src_api_sales__slug__route_ts.GET);
router.put('/sales/:slug', src_api_sales__slug__route_ts.PUT);
router.get('/sales', src_api_sales_route_ts.GET);
router.post('/sales', src_api_sales_route_ts.POST);
router.get('/supplier/:slug', src_api_supplier__slug__route_ts.GET);
router.put('/supplier/:slug', src_api_supplier__slug__route_ts.PUT);
router.get('/supplier', src_api_supplier_route_ts.GET);
router.post('/supplier', src_api_supplier_route_ts.POST);
router.get('/user', src_api_user_route_ts.GET);
router.post('/user', src_api_user_route_ts.POST);


export default router