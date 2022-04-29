import * as fs from 'fs';

class FileService {

  loadFile(fileName) {
    return new Promise((resolve, reject) => fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    }));
  }

  saveFile(fileName, content) {
    return new Promise((resolve, reject) => fs.writeFile(fileName, content, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    }));
  }

}

export const fileService = new FileService();
