import { parseBlob } from '../../library/tofromblob/extractblob.js';
import { importBlob } from '../../library/importir/importfile.js';
import { whatis } from '../../library/aids/whatis/whatis.js';
import { handleSignIn } from './handleSignIn.js';
import { handleSignUp } from './handleSignUp.js';
import { handleCheckUserName } from './handleCheckUserName.js';

export function handleWs(_data,sock){
   const type = whatis(_data);
   
   switch (type) {
      case 'string': return handleStringMsgFrWs(_data, sock)
      case 'Blob' : return handleBlobMsgFrWs(_data, sock)
      default:
         break;
   }
   sock.send('done')
}

function handleStringMsgFrWs(data, sock){
   switch (data) {
      case 'tofromblob': {
         const blobifyBlob = importBlob('./serv/library/tofromblob/blobify.js')//await fetchFile(new URL('../../library/tofromblob/blobify.js',meta.url),'blob') 
         const extractBlob = importBlob('./serv/library/tofromblob/extractblob.js')//await fetchFile(new URL('../../library/tofromblob/extractblob.js',meta.url),'blob') 
         return sock.send(new Blob([blobifyBlob, extractBlob]))
      }
      case 'session': {
         sessionStorage.setItem('session',crypto.randomUUID())
         
         return sock.send(sessionStorage.getItem('session'))
      }
      default:
         break;
   }
}

async function handleBlobMsgFrWs(_blob, sock){
   
   const { action, data } = await parseBlob(_blob);
   switch (action) {
      case 'signIn': return handleSignIn(data, sock);
      case 'signUp': return handleSignUp(data, sock);   
      case 'checkUserName' : return handleCheckUserName(data, sock);
   
      default:
         break;
   }
   return
}
