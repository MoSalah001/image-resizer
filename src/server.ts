import express from 'express';
import routes from './routes/main';
import path from 'path';

const app = express();
const port: any  = process.env.PORT || 3000;

app.use(express.static(path.dirname(__dirname) + '/client'));

app.use('/api', routes);

app.listen(port, () => {
  console.log(`server is running on Port:${port}`);
});

export default app;
