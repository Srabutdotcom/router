import { writeBlob, readBlob } from "../../library/tofromblob/savefile.js";
const PATH_MIMETYPES = './serv/router/mimetypes/mimetypes.dat'

// deno-lint-ignore no-unused-vars
function onmessage(e){
   const [ext, mime] = e.data;
   if(mimetypes.has(ext))return;
   mimetypes.set(ext,mime)
   writeBlob('./serv/router/mimetypes/mimetypes.dat',mimetypes);console.log('done write mimetypes')
   //postMessage(r)
}

export const mimetypes = await readBlob(PATH_MIMETYPES)??new Map;