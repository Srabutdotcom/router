import { contentType } from "https://deno.land/std@0.208.0/media_types/mod.ts";
import { writeBlob, readBlob } from "../library/tofromblob/savefile.js";

const PATH_MIMETYPES = './serv/router/mimetypes.dat'
const mimetypes = await readBlob(PATH_MIMETYPES)??new Map;debugger;

export function serveFile(filepath = new URL) {
   return new Promise(function (resolve, _reject) {
      fetch(filepath)
         .then(response => response.blob())
         .then(blob => {
            
            const ext = filepath.pathname.split('.').pop();
            const mime = mimetypes.get(ext)??contentType(ext); 
            mimeTypesProxy.set(ext, mime);
            const headers = new Headers({
               'Content-Type': mime
            })
            return resolve(
               new Response(
                  new Blob([blob], { type: mime }),
                  headers
               )
            )
         })
   })
}

const mimeTypesProxy = new Proxy(mimetypes, {
   get(target, name, receiver) {
      const value = Reflect.get(target, name);
      if (value instanceof Function) {    // ***  
         return function (...args) {
            value.apply(this === receiver ? target : this, args);
            writeBlob(PATH_MIMETYPES,mimetypes)
            return true//value.apply(this === receiver ? target : this, args);
          };
      }                                   // ***
      return value;
   }
})