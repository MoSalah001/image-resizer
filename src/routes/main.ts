import express from 'express';
import fs from 'fs';
import path from 'path';
import Busboy from 'busboy';
import resize from './api/resize';
interface fileData {
  path: string;
  name: string;
  width: number;
  height: number;
  ext: string;
}
let fileData: fileData;
interface fileName {
  filename: string;
  encoding: string;
  mimetype: string;
}
const routes = express.Router();
routes.post('/', (req, res) => {
  const apiPath = path.join(__dirname, `/api/full-images/`);
  if (!fs.existsSync(apiPath)) {
    fs.mkdirSync(apiPath, { recursive: true });
  }
  const busboy = Busboy({ headers: req.headers });
  // "@ts-expect-error"
  busboy.on('file', (fieldname: string, file: any, filename: fileName) => {
    const length = fs.readdirSync(apiPath).length;
    const index = filename.filename.indexOf('.');
    const ext = filename.filename.slice(index);
    const imageName = `image-${length}`;
    const saveOrg = path.join(
      __dirname,
      `/api/full-images/` + imageName + `${ext}`
    );
    fileData = {
      path: saveOrg,
      name: imageName,
      width: 0,
      height: 0,
      ext: ext,
    };
    if (!fs.existsSync(apiPath)) {
      fs.mkdirSync(apiPath, { recursive: true });
    }
    file.pipe(fs.createWriteStream(saveOrg));
  });
  busboy.on('field', (name: string, val: string) => {
    busboy.on('finish', () => {
      if (name === 'width') {
        fileData.width = parseInt(val);
      } else {
        fileData.height = parseInt(val);
      }
    });
  });

  busboy.on('finish', (): void => {
    setTimeout(async () => {
      const result = await resize(fileData);
      setTimeout(() => {
        res
          .status(301)
          .send(
            `\\api\\image?image=${result.name}&width=${result.width}&height=${
              result.height
            }&ext=${result.ext.slice(1)}`
          );
      }, 1000);
    }, 2000);
  });
  return req.pipe(busboy);
});

routes.get('/image', (req, res) => {
  const file = path.join(
    __dirname,
    `/api/thumb/${req.query.image}_${req.query.width}_${req.query.height}.${req.query.ext}`
  );
  res.contentType('image/png');
  res.type('png');
  res.sendFile(file, {
    maxAge: 2000,
    dotfiles: 'allow',
  });
});

export default routes;
