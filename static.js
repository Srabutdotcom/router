import { contentType } from "./deps.js";
import { mimetypes } from "./mimetypes/savemimeworker.js";

const mimeWorker = new Worker(new URL('./mimetypes/savemimeworker.js', import.meta.url).href,  { type: "module" });

export function serveFile(filepath = new URL) {
   return new Promise(function (resolve, _reject) {
      fetch(filepath)
         .then(response => {;return response.blob()})
         .then(blob => { 
         
            const ext = filepath.pathname.split('.').pop();
            const mime = mimetypes.get(ext)??contentType(ext); 
            // save and update mimetypes for latter use
            mimeWorker.postMessage([ext, mime])
            
            const headers = new Headers({
               'Content-Type': mime,
               'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Methods': 'GET',
               'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
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