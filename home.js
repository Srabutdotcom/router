import { fetchFile } from './utils.js'
import { baseUrl } from '../../meta.js'

export async function handleHome(_req){
  const text = await fetchFile(new URL('./serv/html/home.htm',baseUrl),'text')

  return new Response(text,
    {"headers":new Headers({
        'Content-Type': 'text/html; charset=UTF-8'
      })
    });
}

export async function handleError(msg){
  console.debug(msg);
  Deno.exit(); throw new Error(msg);
  let text = await fetchFile(new URL('./serv/html/error.htm',baseUrl),'text')
  text = text.replace('{err}',msg)

  return new Response(text,
    {"headers":new Headers({
        'Content-Type': 'text/html; charset=UTF-8'
      })
    });
}

export function handleIsNotFound(msg="message"){
  return new Response(msg,
    {"headers":new Headers({
        'Content-Type': 'text/html; charset=UTF-8'
      })
    });
}