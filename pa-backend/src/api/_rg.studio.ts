//rg-express
import { Request, Response, Router } from 'express'; 
const router = Router(); 
let apiUrls: string[] = ["get:/auth/login","get:/customer/:slug","put:/customer/:slug","get:/customer","get:/org","post:/org","get:/product/:slug","put:/product/:slug","get:/product","post:/product","get:/purchase/:slug","put:/purchase/:slug","get:/purchase","post:/purchase","get:/sales/:slug","put:/sales/:slug","get:/sales","post:/sales","get:/supplier/:slug","put:/supplier/:slug","get:/supplier","post:/supplier","get:/user","post:/user"]
router.get('/_rg/studio/apis', (_req: Request, res: Response) => {

  const listItems = apiUrls.map(item =>{
    if(/get/i.test(item.split(':')[0])){
      return  `<li> <a href="${item.split(':').slice(1).join('/')}">${item}</a></li>`
    }else{
      return `<li> ${item}</li>`
    }
  }).join('');
  

    const htmlResponse = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <h1>API List</h1>
        <ul>
          ${listItems}
        </ul>
      </body>
    </html>
     `
    
    res.send(htmlResponse);
});




export default router