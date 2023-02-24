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
routes.post('/', (req: express.Request, res: express.Response): object => {
  const apiPath = path.join(__dirname, `/api/full-images/`);
  if (!fs.existsSync(apiPath)) {
    fs.mkdirSync(apiPath, { recursive: true });
  }
  const busboy = Busboy({ headers: req.headers });
  // "@ts-expect-error"
  busboy.on('file', (fieldname: string, file: any, filename: fileName) => {
    if (filename.filename) {
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
    } else {
      res.status(404).send('No file Recieved Please choose a file');
    }
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

routes.get('/image', (req: any, res: any): void => {
  const imageObj: fileData = {
    name: req.query.image,
    width: parseInt(req.query.width),
    height: parseInt(req.query.height),
    ext: "."+req.query.ext,
    path: ""
  } 
  
  
  const file = path.join(
    __dirname,
    `/api/thumb/${imageObj.name}_${imageObj.width}_${imageObj.height}${imageObj.ext}`
  );
  const fileOrigin = path.join(__dirname,`/api/full-images/${imageObj.name}${imageObj.ext}`)
  if (fs.existsSync(file)) {
    
    res.contentType(`image/${imageObj.ext.slice(1)}`);
    res.status(200).sendFile(file, {
      maxAge: 36000,
      dotfiles: 'allow',
    });
  } else if(fs.existsSync(fileOrigin)){
    
    imageObj.path = fileOrigin
    setImmediate(async () =>{      
      await resize(imageObj)
      .then(()=>{
        setTimeout(()=>{
          res.contentType(`image/${imageObj.ext.slice(1)}`)
          res.status(200).sendFile(file, {
          maxAge: 36000,
          dotfiles: 'allow',
          });
        },2000)
      })        
    })
    
  } else {
    res.status(404).send('File Not Found. Please enter a valid image name, width, and height');
  }
});

export default routes;
