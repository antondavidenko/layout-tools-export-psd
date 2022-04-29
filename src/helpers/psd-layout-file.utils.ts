import * as PSD from 'psd';
import { filePaths } from '../file-paths.model';

const rootFolder = 'export/';

class PSDlayoutFileClass {

  private psd;

  deepForEach(tree, callback, path) {
    path = path || '';
    tree.forEach((child) => {
      child.path = path;
      [child.nameId] = child.name.split(': ');
      child.typeId = child.name.split(': ')[1] || 'png';
      child.typeId = child.type === 'group' ? 'group' : child.typeId;
      callback(child);
      if (child.type === 'group') {
        this.deepForEach(child.children, callback, `${child.name}/`);
      }
    });
  }

  async forAllChilds(callback) {
    this.psd = await PSD.fromFile(filePaths.psdSrc);
    this.psd.parse();
    this.deepForEach(this.psd.tree().export().children, (child) => {
      let path = `${child.path}${child.name}`;
      path = path.indexOf(rootFolder) !== 0 ? `${rootFolder}${path}` : path;
      const node = this.psd.tree().childrenAtPath(path);
      child.typeId = child.name.split(': ')[1] || 'png';
      child.typeId = child.type === 'group' ? 'group' : child.typeId;
      callback(child, node);
    }, '');
  }

  async forGroupChilds(groupId, callback) {
    this.psd = await PSD.fromFile(filePaths.psdSrc);
    this.psd.parse();
    const group = this.psd.tree().childrenAtPath(groupId)[0];
    group.export().children.forEach((child) => {
      [child.nameId] = child.name.split(': ');
      child.typeId = child.name.split(': ')[1] || 'png';
      child.typeId = child.type === 'group' ? 'group' : child.typeId;
      callback(child);
    });
  }

  exportPng(name, child) {
    child.path = child.path === undefined ? rootFolder : child.path;
    const path = child.path === rootFolder ? child.path : `${rootFolder}${child.path}`;
    const layer = this.psd.tree().childrenAtPath(`${path}${name}`)[0];
    const [fileName] = child.name.split(': ');
    layer.saveAsPng(`${filePaths.imagesFolder}/${fileName}.png`);
  }

}

export const PSDlayoutFile = new PSDlayoutFileClass();
