import supertest from 'supertest';
import resize from '../routes/api/resize';
import server from '../server';
const app = supertest(server);

const filePath = {
  name: 'image-0',
  path: __dirname + 'routes/api/full-images/image-0.png',
  width: 200,
  height: 200,
  ext: '.png',
};

describe('resize function suite tests', () => {
  it('it should pass a file to sharp resize function', (): void => {
    expect(resize(filePath)).toBeTruthy;
  });

  it("this should generate an error. Image can't be found", () => {
    filePath.path = __dirname + 'routes/api/full-images/image-55.png';
    expect(resize(filePath)).toThrowError;
  });
});

describe('server routes suite tests', () => {
  it('it should serve the image when found-this is correct', async () => {
    const res = await app.get(
      '/api/image?image=image-5&width=200&height=200&ext=png'
    );
    expect(res.statusCode).toBe(200);
  });

  it('it should serve the image when found-this should fail', async () => {
    const res = await app.get(
      '/api/image?image=image-400&width=200&height=200&ext=png'
    );
    expect(res.statusCode).toBe(200);
  });
});
