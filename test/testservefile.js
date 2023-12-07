const meta = import.meta;
const url = new URL('./testservefile.js',meta.url);
import { serveFile } from '../static.js';
debugger;
const a = await serveFile(url);debugger;