/* eslint-disable newline-per-chained-call */
import * as fs from 'fs';
import { getContent } from '../helpers/template.utils';
import { filePaths } from '../file-paths.model';
import { PSDlayoutFile } from '../helpers/psd-layout-file.utils';

class ExportL10nFromPsd {

  async run() {
    let nodeList = '';
    const nodesPayload = [];

    await PSDlayoutFile.forAllChilds(async (child) => {
      if (child.typeId === 'text') {
        nodesPayload.push(this.getl10nPayload(child));
      }
    });

    for (let i = 0; i < nodesPayload.length; i++) {
      const data = await getContent('l10n', 'l10n-node', nodesPayload[i]);
      const newline = i === nodesPayload.length - 1 ? '' : ',\n';
      nodeList += `${data}${newline}`;
    }

    const l10nContent = await getContent('l10n', 'l10n-main', { nodeList });
    fs.writeFileSync(filePaths.l10n, l10nContent);
    return new Promise((resolve) => { resolve(true); });
  }

  private getl10nPayload(child) {
    const transY = child.text.transform.yy;
    let fontSize = child.text.font.sizes[0];
    fontSize = Math.round((fontSize * transY) * 100) * 0.01;
    const size = parseInt(fontSize, 10);

    const text = escape(child.text.value)
      .split('%20').join(' ')
      .split('%21').join('!')
      .split('%0D').join('\\n')
      .split('%03').join('\\n')
      .split('%3F').join('?');
    return { text, size, name: child.nameId };
  }

}

export const exportL10nFromPsd = new ExportL10nFromPsd();
