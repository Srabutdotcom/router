import { baseUrl } from '../../../meta.js';
import { createResponse, fetchFile } from '../utils.js';

export function handleApi(req){
   const sp=new URL(req.url).searchParams
   const request = sp.get('request');
   const requestMap = {
      'file': ()=>responseFile(sp)
   }
   return requestMap[request]();
}

async function responseFile(params){
   const filepath = params.get('filepath');
   /* const filename = params.get('filename');
   const type = params.get('type');
   const path = params.get('path') */
   const pathname = new URL(`./serv/forclient/${filepath}`,baseUrl);
   const blob = await fetchFile(pathname,'blob');
   return await createResponse(blob,filepath)
}