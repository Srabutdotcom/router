import { isoBase64URL, isoUint8Array } from '../../library/webauthn/src/helpers/iso/index.ts';
import { parseAuthenticatorData } from '../../library/webauthn/src/helpers/parseAuthenticatorData.ts';
import { toHash } from '../../library/webauthn/src/helpers/toHash.ts';
import { verifySignature } from '../../library/webauthn/src/helpers/verifySignature.ts';
import { convertPEMToBytes } from '../../library/webauthn/src/helpers/convertPEMToBytes.ts';
import { decoder, encoder } from '../../library/converter/encodecode.js';
import { user } from '../../../database/platform.js';
import { isIdNotEqToRawId, isChallengeNotMatch } from './helpers/helpers.js';


export async function handleSignIn(data, sock) {

  // TODO: this should be authenticated in browser, there is mediation availability....
  // https://github.com/MasterKale/SimpleWebAuthn/blob/master/packages/browser/src/methods/startAuthentication.ts#L7
  const { id, rawId, response: assertionResponse, type: credentialType } = data;
  if(!id) throw new Error('Missing credential ID');
  if(isIdNotEqToRawId(id, rawId)) throw new Error('Credential ID was not base64url-encoded');
  if(credentialType !== 'public-key') throw new Error(`Unexpected credential type ${credentialType}, expected "public-key"`);
  if(!assertionResponse) throw new Error('Credential missing response');

  const { authenticatorData, clientDataJSON, signature: signatureBuffer, userHandle } = assertionResponse;
  const clientDataJSONString = decoder.decode(clientDataJSON); debugger;
  if(typeof clientDataJSONString !== 'string') throw new Error('Credential response clientDataJSON was not a string');
  /* if(!isoBase64URL.isBase64url(authenticatorData)) throw new Error('Credential response authenticatorData was not a base64url string')
  if(!isoBase64URL.isBase64url(signature)) throw new Error('Credential response signature was not a base64url string'); */
  const userHandleString = decoder.decode(userHandle);
  if(userHandleString && typeof userHandleString !== 'string') throw new Error('Credential response userHandle was not a string');

  const clientData = JSON.parse(clientDataJSONString);
  const { challenge: base64url_challenge, type, /* origin, crossOrigin, topOrigin */ } = clientData;
  // NOTE - bypass origin, crossOrigin, and topOrigin
  if(type !== 'webauthn.get') throw new Error(`Unexpected authentication response type: ${type}`);

  if(isChallengeNotMatch(base64url_challenge)) throw new Error(`Unexpected authentication response challenge "${challenge}", expected "${expectedChallenge}"`);

  const parsedAuthData = parseAuthenticatorData(new Uint8Array(authenticatorData));
  const { rpIdHash, flags, counter, extensionsData } = parsedAuthData;

  const clientDataHash = await toHash(new Uint8Array(clientDataJSON));

  const signatureBase = isoUint8Array.concat([new Uint8Array(authenticatorData), clientDataHash]);

  const signature = new Uint8Array(signatureBuffer);
  const userData = user();
  const userPublicKey = isoBase64URL.toBuffer(userData.devices[0].response.publicKey); debugger;

  const pk = `-----BEGIN PUBLIC KEY-----
   MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtEMpAHPA74gCwww_UfVtXK1alahafz-Q58heD_QIk02poQO9HPSsyr6ZI8quXGYDH4YvUaXuS5UBz8k8X9166zc-QCb1GxZ47Mf7L_0OwuMEraxKF2S1ktF8EyWSuAbSrcuFsUJ_o69upnCYqwaLs6c_c2muPCc0HiEMM1KEha5KRN37wBNtTlC5ZkOKSMs_X6bjWI2aGiQ94wjdAQNGrYvKjPd6EzLaNRJvPkPs-gV6NwwnEdxoOzURnCxRq46A1pn7mOdwKh8nE3Xnm_0_S9ogCe8nD-HcsRY89JfrRYn71sbAcAjzwysLQ9PnNTCFOCXr56wsNHFmjJVrJN4ukQIDAQAB
   -----END PUBLIC KEY-----`;
  const ids = 'BUJ-RFauBTKCnxnm35-9uwPG-qdfHnQTuEfU636hirQ';

  const publicKey = convertPEMToBytes(pk); debugger;

  const verified = await verifySignature({
    signature,
    data: signatureBase,
    credentialPublicKey: publicKey,
  });
  debugger;

  sock.send('Done');

}


