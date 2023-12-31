const baseUrl = import.meta.url;
import { writeBlob, readBlob } from '../deps.js';
const PATH_MIMETYPES = new URL('./mimetypes.dat', baseUrl)

// deno-lint-ignore no-unused-vars
function onmessage(e){
   const [ext, mime] = e.data;
   if(mimetypes.has(ext))return;
   mimetypes.set(ext,mime)
   writeBlob(PATH_MIMETYPES,mimetypes);console.log('done write mimetypes')
   //postMessage(r)
}

export const mimetypes = await readBlob(PATH_MIMETYPES)??new Map;