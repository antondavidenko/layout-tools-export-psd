import * as fs from 'fs';
import { createInterface } from 'readline';

const typeDictionary = {
  image: 'Phaser.GameObjects.Image',
  container: 'Phaser.GameObjects.Container',
  text: 'Phaser.GameObjects.Text',
  sprite: 'Phaser.GameObjects.Sprite',
  spine: 'SpineGameObject',
};

class LayoutParser {

  getList(fileName) {
    return new Promise((resolve) => {
      let list = '';

      const lineReader = createInterface({
        input: fs.createReadStream(fileName),
      });

      lineReader.on('line', (line) => {
        if ((line.indexOf('"type":') >= 0) && (line.indexOf('"id":') >= 0)) {
          if (list !== '') {
            list += '\n';
          }
          list += this.layoutNodeParser(line);
        }
      });

      lineReader.on('close', () => {
        resolve(list);
      });
    });
  }

  private layoutNodeParser(line) {
    const lineData = JSON.parse(line.replace('},', '}'));
    return `  ${lineData.id}: ${typeDictionary[lineData.type]},`;
  }

}

export const layoutParser = new LayoutParser();
