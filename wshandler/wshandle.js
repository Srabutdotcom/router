const meta = import.meta
import { parseBlob } from '../../library/tofromblob/extractblob.js';
import { fetchFile } from '../utils.js';
import { typeofData } from '../../library/basic/typeof.js';
import { handleSignIn } from './handleSignIn.js';
import { handleSignUp } from './handleSignUp.js';
import { handleCheckUserName } from './handleCheckUserName.js';

export function handleWs(_data,sock){
   const type = typeofData(_data);
   
   switch (type) {
      case 'string': return handleStringMsgFrWs(_data, sock)
      case 'Blob' : return handleBlobMsgFrWs(_data, sock)
      default:
         break;
   }
   sock.send('done')
}

async function handleStringMsgFrWs(data, sock){
   switch (data) {
      case 'tofromblob': {
         const blobifyBlob = await fetchFile(new URL('../../library/tofromblob/blobify.js',meta.url),'blob') 
         const extractBlob = await fetchFile(new URL('../../library/tofromblob/extractblob.js',meta.url),'blob') 
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
