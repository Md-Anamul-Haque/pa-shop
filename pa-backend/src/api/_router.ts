//rg-express
 import { Router } from 'express'; 
 const router = Router()
            
            
import * as src_api_org_route_ts from './org/route';



router.get('/org', src_api_org_route_ts.GET);
router.post('/org', src_api_org_route_ts.POST);


export default router