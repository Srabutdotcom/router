const meta = import.meta;
const url = new URL('./testservefile.js',meta.url);
import { serveFile } from '../static.js';
const a = await serveFile(url);