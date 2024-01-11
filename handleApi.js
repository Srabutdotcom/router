import { baseUrl, userData, blobify } from './deps.js';//'../../meta.js';
import { handleIsNotFound } from './home.js';
import { serveFile } from './static.js';

/* export async function handleApi(req) {
   const { searchParams } = new URL(req.url)
   const request = searchParams.get('request');
   switch (request) {
      case 'file': return await responseFile(searchParams.get('filepath'))
      default: return handleIsNotFound(`${searchParams.get('filepath')} is not found`)
   }
} */

async function responseFile(searchParams) {
   const filepath = searchParams.get('filepath')
   const pathname = new URL(`./forclient/${filepath}`, baseUrl);
   return await serveFile(pathname);
}

class HandleApi {
   handler = {};
   constructor() {
      this.handle = this.handle.bind(this);
   }

   addHandler(action, handler) {
      if (!this.handler?.[action]) this.handler[action] = handler;
      return
   }

   handle(req, info) {
      const { searchParams } = new URL(req.url)
      const request = searchParams.get('request');
      return this.handler?.[request](searchParams) ?? handleIsNotFound(`${req.url} is not found`)
   }
}

const handleApi = new HandleApi;

handleApi.addHandler('file', responseFile);
handleApi.addHandler('user', responseUser);

async function responseUser(searchParams){
   const name = searchParams.get('name');
   const found = await userData.getUser(name);
   if(!found)return new Response(blobify(false))
   return new Response(blobify(true));
}

export { handleApi }