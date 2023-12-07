const htmlHeader = {
  "headers": new Headers({
    'Content-Type': 'text/html; charset=UTF-8'
  })
}

const htmlString = /* html */
`<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>Aicone</title>    
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:title" content="Aicone">
    <meta property="og:description" content="To make you happier and better">
    <meta property="og:image" content="favicon.ico">
    <meta property="og:url" content="https://aicone.id">
    <meta name="robots" content="index, follow">
    <script src="index.js" type='module'></script>
  </head>
<body class="antialiased">
</body>
</html>`

export function handleHome(_req) {
  return new Response(htmlString, htmlHeader);
}

export function handleError(msg) {
  console.debug(msg);
  Deno.exit(); throw new Error(msg);
}

export function handleIsNotFound(msg = "message") {
  return new Response(msg, htmlHeader);
}