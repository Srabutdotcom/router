const baseUrl = import.meta.url; 
import { ROOT, HTTPPORT, HTTPSPORT } from './deps.js';
//import { log } from '../logger/logger.js';
import { serveFile } from './static.js';
import { handleHome, handleIsNotFound } from './home.js';
import { handleWebsocket } from './websocket.js';
import { pathInfoSync } from './pathinfo.js';//'https://raw.githubusercontent.com/Srabutdotcom/path/master/pathInfo.min.js'//'../library/path/pathInfo.js';
import { handleApi } from './handleApi.js';

/* function logaccess(req, info) {
   const { transport, hostname, port } = info.remoteAddr;
   log(`${transport} ${hostname} ${port} ${req.url}`);
} */

function pathInfo(req, info) {
   // log info to file
   //logaccess(req, info);
   const Url = new URL(req.url);
   const filePath = new URL(ROOT + Url.pathname, baseUrl);
   return {filePath, _pathInfo: pathInfoSync(filePath)}
}

export async function httpsHandler(req, info) {
   const { filePath, _pathInfo } = pathInfo(req, info)
   switch (_pathInfo) {
      case 'isFile':
      case 'isSymlink': {
         return await serveFile(filePath);
      }
      case 'isNotFound':
      case 'isDirectory': return dirTypes(req, info)
   }
}

export async function httpHandler(req, info) {
   const { filePath, _pathInfo } = pathInfo(req, info)
   switch (_pathInfo) {
      case 'isFile':
      case 'isSymlink': {
         return await serveFile(filePath);
      }
      case 'isNotFound':
      case 'isDirectory': return dirTypesForHttp(req, info)
      default: return redirectoHttps(req, info)
   }
}

function dirTypesForHttp(req, info) {
   const url = new URL(req.url);
   switch (url.pathname) {
      case '/api': { return handleApi(req) }
      default: return redirectoHttps(req, info)
   }
}

function dirTypes(req, info) {
   const url = new URL(req.url);
   switch (url.pathname) {
      case '/': return handleHome(req, info)
      case '/ws': 
         if (req.headers.get("upgrade").toLowerCase() === 'websocket') return handleWebsocket(req);
         return handleIsNotFound(`${url.href} is not found`)
      case '/api': { return handleApi(req) }
      default:
         return handleIsNotFound(`${url.href} is not found`)
   }
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
   if(hostname ==='localhost')return req.url.replace('http','https').replace(HTTPPORT, HTTPSPORT) 
   return req.url.replace('http', 'https')
}
