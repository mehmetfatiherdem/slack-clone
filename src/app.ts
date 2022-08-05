import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import routes from './routes/Index';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './data-source';
import path from 'path';
import { isLoggedIn } from './middlewares/auth/isLoggedIn';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: false }));

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    console.log(`app data init`);
  })
  .catch((error) => console.log(error));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
  res.render(`auth.ejs`);
});

app.get('/app', isLoggedIn, (req, res) => {
  res.send(`front end coming soon..`);
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Express is listening at ${port}`);
});

export default app;
