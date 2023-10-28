//rg-express
import { Request, Response, Router } from 'express'; 
const router = Router(); 
let apiUrls: string[] = ["get:/org","post:/org"]
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