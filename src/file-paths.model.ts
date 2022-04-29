import * as fs from 'fs';
import * as path from 'path';

type FileConfig = {
  srcFolder: string,
  assetsFolder: string,
  l10nFolder: string,
  typesFolder: string,
}

class FilePaths {

  private gameRoot: string;
  private toolRoot: string;
  private layoutId: string;
  private filesConfig: FileConfig;

  async init(gameRoot, toolRoot, layoutId) {
    this.gameRoot = gameRoot;
    this.toolRoot = toolRoot;
    this.layoutId = layoutId;
    const filesConfigString = fs.readFileSync(path.resolve(this.gameRoot, 'layout-tools.config.json')).toString();
    this.filesConfig = JSON.parse(filesConfigString);
    return new Promise((resolve) => { resolve(true); });
  }

  get psdSrc() {
    return path.resolve(this.gameRoot, this.filesConfig.srcFolder, `${this.layoutId}.psd`);
  }

  get positionsList() {
    return path.resolve(this.gameRoot, this.filesConfig.assetsFolder, `${this.layoutId}-positions.json`);
  }

  get elementsList() {
    return path.resolve(this.gameRoot, this.filesConfig.assetsFolder, `${this.layoutId}-elements.json`);
  }

  get imagesFolder() {
    return path.resolve(this.gameRoot, this.filesConfig.assetsFolder, `${this.layoutId}/`);
  }

  get stylesList() {
    return path.resolve(this.gameRoot, this.filesConfig.l10nFolder, 'text-styles.json');
  }

  get l10n() {
    return path.resolve(this.gameRoot, this.filesConfig.l10nFolder, 'en.json');
  }

  get layoutTypings() {
    return path.resolve(this.gameRoot, this.filesConfig.typesFolder, `${this.layoutId}-layout.typing.ts`);
  }

  get templateSource() {
    return path.resolve(this.toolRoot, '../src/templates/layout.typings.template.txt');
  }

  get layoutName() {
    return this.layoutId.charAt(0).toUpperCase() + this.layoutId.slice(1);
  }

  getTemplate(folder: string, id: string) {
    return path.resolve(this.toolRoot, `../src/templates/${folder}/${id}.template.txt`);
  }

}

export const filePaths = new FilePaths();
