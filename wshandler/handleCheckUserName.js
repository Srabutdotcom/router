import { userkv } from '../../database/database.js'
import { blobify } from "../../library/tofromblob/blobify.js";
import { isUserNameValid } from "../../library/validator/username/username.js";
import { booleanObject } from "../../library/object/boolean.js";

export async function handleCheckUserName(userName, sock) {
   const _IsUserNameValid = isUserNameValid(userName);
   if (_IsUserNameValid == false) sock.send(blobify(_IsUserNameValid));
   const { value } = await userkv.get(['name', userName]);
   if (value == null) sock.send(blobify(booleanObject(true, `${userName} is available`)));
   sock.send(blobify(booleanObject(false, `${userName} is already taken`)))
}