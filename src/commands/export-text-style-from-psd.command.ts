/* eslint-disable newline-per-chained-call */
import * as fs from 'fs';
import { getContent } from '../helpers/template.utils';
import { filePaths } from '../file-paths.model';
import { PSDlayoutFile } from '../helpers/psd-layout-file.utils';

class ExportTextStyleFromPsd {

  async run() {
    let nodeList = '';
    const nodesPayload = [];

    await PSDlayoutFile.forAllChilds((child, node) => {
      if (child.typeId === 'text') {
        const effects = node[0].get('objectEffects') || { data: [] };
        nodesPayload.push(this.getStylePayload(child, effects.data));
      }
    });

    for (let i = 0; i < nodesPayload.length; i++) {
      const data = await getContent('textstyle', 'textstyle-node', nodesPayload[i]);
      const newline = i === nodesPayload.length - 1 ? '' : ',\n';
      nodeList += `${data}${newline}`;
    }

    const contentStyles = await getContent('textstyle', 'textstyle-main', { nodeList });
    fs.writeFileSync(filePaths.stylesList, contentStyles);
    return new Promise((resolve) => { resolve(true); });
  }

  private getStylePayload(child, effects) {
    const name = `${child.nameId}Style`;
    const color = this.getColor(child.text.font.colors[0]);
    return { name, color, stroke: this.getStroke(effects), shadow: this.getShadow(effects) };
  }

  private getColor(color) {
    return `#${this.getColorNode(color[0])}${this.getColorNode(color[1])}${this.getColorNode(color[2])}`;
  }

  private getColorNode(node) {
    let value = node.toString(16);
    value = value.length === 1 ? `0${value}` : value;
    return value;
  }

  private getStroke(effects): string {
    let result = '';
    if (effects.FrFX) {
      const color = [Math.round(effects.FrFX['Clr ']['Rd  ']), Math.round(effects.FrFX['Clr ']['Grn ']), Math.round(effects.FrFX['Clr ']['Bl  '])];
      result += `\n    stroke: '${this.getColor(color)}',`;
      result += `\n    strokeThickness: ${effects.FrFX['Sz  '].value * 3},`;
    }
    return result;
  }

  private getShadow(effects): string {
    let result = '';
    if (effects.DrSh) {
      const color = [Math.round(effects.DrSh['Clr ']['Rd  ']), Math.round(effects.DrSh['Clr ']['Grn ']), Math.round(effects.DrSh['Clr ']['Bl  '])];
      const blur = effects.DrSh.blur.value;

      const angleRadians = effects.DrSh.lagl.value * (Math.PI / 180);
      const distance = effects.DrSh.Dstn.value;
      const offsetX = Math.round(-distance * Math.cos(angleRadians));
      const offsetY = Math.round(distance * Math.sin(angleRadians));
      result += `\n    shadow: { color: '${this.getColor(color)}', fill: true, blur: ${blur}, offsetX: ${offsetX}, offsetY: ${offsetY} },`;
    }
    return result;
  }

}

export const exportTextStyleFromPsd = new ExportTextStyleFromPsd();
