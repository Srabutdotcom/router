import { log } from '../logger/logger.js';
import { handleStatic } from './static.js';
import { handleHome, handleError } from './home.js';
import { handleWebsocket } from './websocket.js';
import { pathType } from '../library/path/pathtype.js';
import { handleApi } from './wshandler/handleApi.js';

export async function handler(req, info) {
   // log info to file
   logaccess(req, info)
   
   const pathInfo = pathType(req)
   //debugger;
   const pathMap = {
      'isHome': ()=>handleHome(req),
      'isFile': ()=>handleStatic(req, pathInfo.data),
      'isNotFound': ()=>handleError(`${pathInfo.data.pathname} is Not Found`),
      'isWebsocket': ()=>handleWebsocket(req),
      'isSymlink': ()=>handleError('is Symlink'),
      'isApi':()=>handleApi(req)
   }
   //debugger;
   return pathMap?.[""+pathInfo]();
   
}

function logaccess(req, info) {
   const { transport, hostname, port } = info.remoteAddr;
   log(`${transport} ${hostname} ${port} ${req.url}`);
}
