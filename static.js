import { fetchFile, createResponse } from "./utils.js";

export async function handleStatic(req, filePath){console.debug('handleStatic :' + filePath)
   const blob = await fetchFile(filePath,'blob');
   return await createResponse(blob, filePath.pathname)
}