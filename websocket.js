import { handleWs } from '../wshandler/wshandler.js';

export function handleWebsocket(req) {
  
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.binaryType = 'blob'
  socket.onopen = (e) => { console.log('socket opened: '+e) }
  socket.onmessage = async (e) => {
    //* data to handle
    if (socket.readyState === socket.CLOSING) { console.log('socket is closing'); return; }
    handleWs.handle(e.data, socket);
  };
  socket.onerror = (e) => { console.log("socket errored:", e); }
  socket.onclose = (_e) => { console.log("socket closed"); }
  return response;
}


