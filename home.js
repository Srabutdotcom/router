import { fetchFile } from './utils.js'
import { meta } from '../../server.js'

export async function handleHome(req){
  const text = await fetchFile(new URL('./serv/html/home.htm',meta.url),'text')

  return new Response(text,
    {"headers":new Headers({
        'Content-Type': 'text/html; charset=UTF-8'
      })
    });
}

export async function handleError(msg){console.debug(msg);Deno.exit(); throw new Error(msg);
  let text = await fetchFile(new URL('./serv/html/error.htm',meta.url),'text')
  text = text.replace('{err}',msg)

  return new Response(text,
    {"headers":new Headers({
        'Content-Type': 'text/html; charset=UTF-8'
      })
    });
}