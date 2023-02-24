import express from 'express';
import routes from './routes/main';
import path from 'path';

const app = express();
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000;

app.use(express.static(path.dirname(__dirname) + '/client'));

app.use('/api', routes);

app.listen(port, host, () => {
  console.log(`server is running on ${host}:${port}`);
});

export default app;
