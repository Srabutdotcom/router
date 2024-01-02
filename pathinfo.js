//type pathInfo = "isFile"| "isDirectory"| "isSymlink" |"isNotFound"

/**
 * Returning lstat info.
 * Requires the `--allow-read` and `--allow-write` flag.
 */
export function pathInfoSync(filePath=new URL()||'string'/* : string */)/* : pathInfo */ {
   let stat
   try {
     // if file exists
     stat = Deno.lstatSync(filePath);
     
   } catch (err) {
     // if file not exists
     if (err instanceof Deno.errors.NotFound) {
       return "isNotFound";
     }
     throw err;
   }
   return stat.isFile?"isFile":stat.isDirectory?"isDirectory":stat.isSymlink?"isSymlink":"isNotFound"
 }

/**
* Returning lstat info.
* Requires the `--allow-read` and `--allow-write` flag.
*/
export async function pathInfo(filePath/* : string */)/* : Promise<pathInfo> */ {
   let stat
   try {
       // if file exists
       stat = await Deno.lstat(filePath);
   } catch (err) {
       // if file not exists
       if (err instanceof Deno.errors.NotFound) {
       return "isNotFound";
       }
       throw err;
   }
   return stat.isFile?"isFile":stat.isDirectory?"isDirectory":stat.isSymlink?"isSymlink":"isNotFound"
}