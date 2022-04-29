import * as fs from 'fs';
import { filePaths } from '../file-paths.model';
import { PSDlayoutFile } from '../helpers/psd-layout-file.utils';

class ExportPositionsFromPsd {

  async run() {
    let listPositions = '';

    await PSDlayoutFile.forAllChilds((child) => {
      if (child.type !== 'group' && child.typeId !== 'texture' && child.path !== '') {
        listPositions = `  { "id": "${child.nameId}", "position": [${child.left}, ${child.top}]},\n${listPositions}`;
      }
    });

    listPositions = `[\n${listPositions.slice(0, -2)}\n]\n`;
    fs.writeFileSync(filePaths.positionsList, listPositions);

    return new Promise((resolve) => { resolve(true); });
  }

}

export const exportPositionsFromPsd = new ExportPositionsFromPsd();
