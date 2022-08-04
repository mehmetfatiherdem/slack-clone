import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';
const app = express();
const port = process.env.PORT || 3000;

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    console.log(`app data init`);
  })
  .catch((error) => console.log(error));

app.get('/', (req, res) => {
  res.send(`swagger coming soon..`);
});

app.listen(port, () => {
  console.log(`Express is listening at ${port}`);
});

export default app;
