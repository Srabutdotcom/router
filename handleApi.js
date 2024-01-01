import { baseUrl } from '../server/meta.js';//'../../meta.js';
import { handleIsNotFound } from './home.js';
import { serveFile } from './static.js';

export async function handleApi(req){
   const {searchParams}=new URL(req.url)
   const request = searchParams.get('request');
   switch (request) {
      case 'file': return await responseFile(searchParams.get('filepath'))
      default: return handleIsNotFound(`${searchParams.get('filepath')} is not found`)
   }
}

async function responseFile(filepath){
   const pathname = new URL(`./serv/forclient/${filepath}`,baseUrl);
   return await serveFile(pathname) ; 
}