import * as fs from 'fs';
import { filePaths } from '../file-paths.model';
import { PSDlayoutFile } from '../helpers/psd-layout-file.utils';

class ExportElementsFromPsd {

  private creators = {
    png: this.createPng.bind(this),
    text: this.createText.bind(this),
    sprite: this.createScript.bind(this),
    spine: this.createScript.bind(this),
    group: this.createGroup.bind(this),
    texture: this.cerateTexture.bind(this),
  };

  async run() {
    let listElements = '';
    if (!fs.existsSync(filePaths.imagesFolder)) {
      fs.mkdirSync(filePaths.imagesFolder);
    }

    await PSDlayoutFile.forGroupChilds('export', (child) => {
      const newElement = this.creators[child.typeId](child.nameId, child);
      if (newElement !== '') {
        listElements = `${newElement}\n${listElements}`;
      }
    });

    listElements = `[\n${listElements.slice(0, -2)}\n]\n`;
    fs.writeFileSync(filePaths.elementsList, listElements);

    return new Promise((resolve) => { resolve(true); });
  }

  private createPng(name, child) {
    PSDlayoutFile.exportPng(name, child);
    return `  { "id": "${name}", "type": "image", "key": "${name}" },`;
  }

  private cerateTexture(name, child) {
    PSDlayoutFile.exportPng(child.name, child);
    return '';
  }

  private createText(name) {
    const style = `${name}Style`;
    return `  { "id": "${name}", "type": "text", "key": "${name}", "style": "${style}" },`;
  }

  private createScript(name, child) {
    return unescape(escape(child.text.value).split('%0D').join('\n'));
  }

  private createGroup(name, child) {
    let subList = '';
    child.children.forEach((subChild) => {
      [subChild.nameId] = subChild.name.split(': ');
      subChild.typeId = subChild.name.split(': ')[1] || 'png';
      subChild.path = `${child.name}/`;
      const newItem = this.creators[subChild.typeId](subChild.nameId, subChild);
      if (newItem !== '') {
        subList = `  ${newItem}\n${subList}`;
      }
    });
    const result = `  { "id": "${name}", "type": "container", "children": [\n${subList}  ] },`;
    const isIgnore = child.name.split(': ')[1] === 'ignore';
    return isIgnore ? '' : result;
  }

}

export const exportElementsFromPsd = new ExportElementsFromPsd();
