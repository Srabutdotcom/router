import { handleWs } from '../wshandler/wshandle.js';

export function handleWebsocket(req) {
  //debugger;
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.binaryType = 'blob'
  socket.onopen = (e) => { console.log(e) }
  socket.onmessage = async (e) => {
    //* data to handle
    if (socket.readyState === socket.CLOSING) { console.log('socket is closing'); return; }
    await handleWs(e.data, socket);
    //return socket.close();debugger;
  };
  socket.onerror = (e) => { console.log("socket errored:", e); }
  socket.onclose = (_e) => { console.log("socket closed"); }
  return response;
  //return new Response("Hello, handleWebsocket");
}


