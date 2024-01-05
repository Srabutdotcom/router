const baseUrl = import.meta.url;
import { ROOT, HTTPPORT, HTTPSPORT, PROTOCOL } from './deps.js';
//import { log } from '../logger/logger.js';
import { serveFile } from './static.js';
import { handleHome, handleIsNotFound } from './home.js';
import { handleWebsocket } from './websocket.js';
import { pathInfoSync } from './pathinfo.js';
import { handleApi } from './handleApi.js';

class Handler {
   handler = {};
   constructor() {
      this.handle = this.handle.bind(this);
   }

   addHandler(pathname, handler) {
      if (!this.handler?.[pathname]) this.handler[pathname] = handler;
      return
   }

   handle(req, info) {
      const Url = new URL(req.url);
      const filePath = new URL(ROOT + Url.pathname, baseUrl);
      const pathInfo = pathInfoSync(filePath); console.log(pathInfo); console.log(Url.pathname)
      switch (pathInfo) {
         case 'isFile':
         case 'isSymlink': return serveFile(filePath);
         case 'isNotFound':
         case 'isDirectory': {
            debugger;
            return this.handler?.[Url.pathname](req, info) ?? handleIsNotFound(`${Url.href} is not found`)
         }
      }
   }
}

const httpsHandler = new Handler;

httpsHandler.addHandler("/", handleHome);
httpsHandler.addHandler("/ws", checkSocket);
httpsHandler.addHandler('/api', handleApi);

function checkSocket(req, info) {
   if (req.headers.get("upgrade").toLowerCase() === 'websocket') return handleWebsocket(req);
   return handleIsNotFound(`${url.href} is not found`)
}

function redirectoHttps(req, info) {
   //return new Response('the body')
   const headers = new Headers();
   const newUrl = httpsURL(req, info);
   headers.set('Location', newUrl)
   const response = new Response('permanently redirect to https',
      { status: 301, headers }
   )
   return response
}

function httpsURL(req = new Request, _info) {
   const { hostname/* , port, protocol, pathname, search */ } = new URL(req.url)
   if (hostname === 'localhost') return req.url.replace('http', 'https').replace(HTTPPORT, HTTPSPORT)
   return req.url.replace('http', 'https')
}

const httpHandler = new Handler;

if (PROTOCOL === 'http') {
   httpHandler.addHandler("/", handleHome);
   httpHandler.addHandler('/api', handleApi);
} else if (PROTOCOL === 'https') {
   httpHandler.addHandler("/", redirectoHttps);
}

export { httpsHandler, httpHandler }
