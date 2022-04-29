import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { filePaths } from '../file-paths.model';
import { layoutParser } from '../helpers/layout-parser.utils';

class BuildLayoutTypings {

  async run() {
    const list = await layoutParser.getList(filePaths.elementsList);
    const source = fs.readFileSync(filePaths.templateSource).toString();
    const template = Handlebars.compile(source);
    const content = template({ list, name: filePaths.layoutName });
    fs.writeFileSync(filePaths.layoutTypings, content);
    return new Promise((resolve) => { resolve(true); });
  }

}

export const buildLayoutTypings = new BuildLayoutTypings();
