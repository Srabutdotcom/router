# Handler for Deno server
Handler for Deno server. Please use my repository named "server"

## Features
1. Handle home '/',
2. Handle static file,
3. Handle Websocket,
4. Handle Api

## How to.
```js
import { handler } from 'handler.js'

Deno.serve({
   port: HTTPPORT, 
   hostname: HOSTNAME, 
},
   handler.handle
);
```

## Dependents
Please see deps.js

