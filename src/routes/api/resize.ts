import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
interface fileData {
  path: string;
  name: string;
  width: number;
  height: number;
  ext: string;
}
export default async function resize(obj: fileData) {
  const destPath = path.join(
    __dirname,
    `thumb\\${obj.name}_${obj.width}_${obj.height}${obj.ext}`
  );

  const checkPath = path.join(__dirname, `thumb`);

  if (!fs.existsSync(checkPath)) {
    fs.mkdirSync(checkPath, { recursive: true });
  }
  fs.readFile(obj.path, (err, data) => {
    if (err) {
      return `Error: ${err}`;
    } else {
      const image: any = sharp(data);
      image
        .resize(obj.width, obj.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toFormat(`${obj.ext.slice(1)}`, { mozjpeg: true })
        .toFile(destPath);
    }
  });
  return obj;
}
