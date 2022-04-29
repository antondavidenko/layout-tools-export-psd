/* eslint-disable newline-per-chained-call */
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { filePaths } from '../file-paths.model';

export async function getContent(folder: string, id: string, payload: any): Promise<string> {
  const source = fs.readFileSync(filePaths.getTemplate(folder, id)).toString();
  const template = Handlebars.compile(source);
  return template(payload)
    .split('&#x27;').join("'")
    .split('&quot;').join('"')
    .split('&amp;#x27;').join("'");
}
