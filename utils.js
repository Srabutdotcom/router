import { contentType } from "https://deno.land/std@0.208.0/media_types/mod.ts";

export async function fetchFile(url, type) {
   //debugger;
   //console.debug('url :', url)
   const response = await fetch(url)
   switch (type) {
      case 'text': return await response.text()
      case 'blob': return await response.blob()
      case 'json': return await response.json()
      case 'response': return response
      default: return response
   }
}

export function createResponse(d, pathname) {
   const mime = contentType(pathname.split('.').pop())
   //! please don't put 'ts' extension file in client directory as ts refer to video i/o typescript based on contentType
   const headers = new Headers({
      'Content-Type': mime
   })
   const blob = new Blob([d],{type:mime})
   return new Response(blob, headers)
}

