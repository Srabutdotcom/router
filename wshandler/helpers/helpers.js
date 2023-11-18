import { base64url_to_string } from '../../../library/converter/base64url2string.js';
import { bufferToBase64URLString } from '../../../library/converter/bufferToBase64URLString.js'

export function isIdNotEqToRawId(id, rawId) {
   return bufferToBase64URLString(rawId) !== id
}

export function isChallengeNotMatch(base64url_challenge) {
   return base64url_to_string(base64url_challenge) !== sessionStorage.getItem('session')
}