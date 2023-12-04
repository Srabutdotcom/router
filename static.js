import { contentType } from "https://deno.land/std@0.208.0/media_types/mod.ts";

export function serveFile(filepath = new URL) {
   return new Promise(function (resolve, _reject) {
      fetch(filepath)
         .then(response => response.blob())
         .then(blob => {
            const mime = contentType(filepath.pathname.split('.').pop()); 
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