import { isIdNotEqToRawId, isChallengeNotMatch } from './helpers/helpers.js';
import { decodeAttestationObject } from '../../library/webauthn/src/helpers/decodeAttestationObject.ts';
import { parseAuthenticatorData } from '../../library/webauthn/src/helpers/parseAuthenticatorData.ts';
import { decoder } from '../../library/converter/encodecode.js';
import { decodeCredentialPublicKey } from '../../library/webauthn/src/helpers/decodeCredentialPublicKey.ts';
import { COSEKEYS } from '../../library/webauthn/src/helpers/cose.ts';
import { blobify } from "../../library/tofromblob/blobify.js";
import { booleanObject } from "../../library/object/boolean.js";
import { userkv } from "../../database/database.js";

export async function handleSignUp(
   signUpResponse,
   sock
) {
   
   const { name, id, rawId, type: credentialType, response: attestationResponse } = signUpResponse;

   if (!id) sock.send(
      blobify(
         booleanObject(
            false,
            'Missing credential ID'
         )));

   if (isIdNotEqToRawId(id, rawId)) sock.send(
      blobify(
         booleanObject(
            false,
            'Credential ID was not base64url-encoded'
         )));
   if (credentialType !== 'public-key') sock.send(
      blobify(
         booleanObject(
            false,
            `Unexpected credential type ${credentialType}, expected "public-key"`
         )));

   const { attestationObject: attsBuffer, clientDataJSON: clientDataBuffer, transports, publicKeyAlgorithm, publicKey: pkBuffer, authenticatorData: authBuffer } = attestationResponse

   const clientDataJSON = decoder.decode(clientDataBuffer); 
   const clientData = JSON.parse(clientDataJSON);
   const { type, challenge: base64url_challenge, origin, tokenBinding } = clientData;
   // NOTE - bypass origin, crossOrigin, and topOrigin
   if (type !== 'webauthn.create') sock.send(
      blobify(
         booleanObject(
            false,
            `Unexpected authentication response type: ${type}`
         )));

   if (isChallengeNotMatch(base64url_challenge)) sock.send(
      blobify(
         booleanObject(
            false,
            `Unexpected authentication response challenge "${challenge}", expected "${expectedChallenge}"`
         )));

   const decodedAttestationObject = decodeAttestationObject(attsBuffer);
   const fmt = decodedAttestationObject.get('fmt');
   const authData = decodedAttestationObject.get('authData');
   const attStmt = decodedAttestationObject.get('attStmt');

   const parsedAuthData = parseAuthenticatorData(authData);

   const {
      aaguid,
      /* rpIdHash, //by pass rpId*/
      flags,
      credentialID,
      /* counter, */
      credentialPublicKey,
      /* extensionsData, */
   } = parsedAuthData;

   // Make sure someone was physically present
   if (!flags.up) sock.send(
      blobify(
         booleanObject(
            false,
            'User not present during registration'
         )));

   // Enforce user verification if specified
   if (!flags.uv) sock.send(
      blobify(
         booleanObject(
            false,
            'User verification required, but user could not be verified',
         )));

   if (!credentialID) sock.send(
      blobify(
         booleanObject(
            false,
            'No credential ID was provided by authenticator'
         )));

   if (!credentialPublicKey) sock.send(
      blobify(
         booleanObject(
            false,
            'No public key was provided by authenticator'
         )));

   if (!aaguid) sock.send(
      blobify(
         booleanObject(
            false,
            'No AAGUID was present during registration'
         )));

   const decodedPublicKey = decodeCredentialPublicKey(credentialPublicKey);
   const alg = decodedPublicKey.get(COSEKEYS.alg);

   if (typeof alg !== 'number') sock.send(
      blobify(
         booleanObject(
            false,
            'Credential public key was missing numeric alg'
         )));

   const defaultSupportedAlgorithmIDs/* : COSEAlgorithmIdentifier[] */ = [-8, -7, -257];

   // Make sure the key algorithm is one we specified within the registration options
   if (!defaultSupportedAlgorithmIDs.includes(alg /* as number */)) {
      const supported = defaultSupportedAlgorithmIDs.join(', ');
      sock.send(
         blobify(
            booleanObject(
               false,
               `Unexpected public key alg "${alg}", expected one of "${supported}"`,
            )));
   }

   debugger;

   let verified = false;
   if (fmt === 'none') {
      if (attStmt.size > 0) {
         sock.send(
            blobify(
               booleanObject(
                  false,
                  'None attestation had unexpected attestation statement'
               )));
      }
      // This is the weaker of the attestations, so there's nothing else to really check
      verified = true;
   }

   if (verified == false) sock.send(
      blobify(
         booleanObject(
            false,
            `the registration cannot be verified`,
         )));

   /**!SECTION information
    *   
      The following data should be saved to the database from the PublicKeyCredential create response:
   
      id: The identifier of the public key credential.
      type: The type of public key credential.
      transports: The transports that the public key credential can be used with.
      attestationObject: The attestation object, which contains information about the creation of the public key credential.
      clientDataJSON: The client data JSON, which contains information about the client that created the public key credential.
      rawId: The raw ID of the public key credential.
      The rawId can be used to identify the public key credential in the user agent. The attestationObject and clientDataJSON can be used to verify the authenticity of the public key credential.
      id can be used to associate the public key credential with a user account. The transports can be used to determine which transports can be used to authenticate the user. The attestationObject and clientDataJSON can be used to verify the authenticity of the public key credential.
   
   */

   const userKey = ["name", name]
   const idKey = ["id", id]
debugger;
   const res = await userkv.atomic()
      /* .check({ userKey, versionstamp: null })
      .check({ idKey, versionstamp: null }) */
      .set(userKey, id)
      .set(idKey, {
         name,
         id,
         type: credentialType,
         transports,
         credentialPublicKey
      })
      .commit()

   if (res.ok) sock.send(
      blobify(
         booleanObject(
            true,
            `The user successfully registered`
         )));

   sock.send(
      blobify(
         booleanObject(
            false,
            `User registration is now successful`
         )));
   debugger;

}