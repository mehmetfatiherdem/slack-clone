import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import routes from './routes/Index';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './data-source';
import path from 'path';
import { isLoggedIn } from './middlewares/auth/isLoggedIn';
import { IGetUserAuthInfoRequest } from './helpers/type';
import { User } from './entity/User';
import cors from 'cors';
const app = express();
import Ws from './services/WebSocketService';
import http from 'http';
const server = http.createServer(app);
Ws.boot(server);
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: false }));

AppDataSource.initialize()
  .then(() => {
    console.log(`app data init`);
  })
  .catch((error) => console.log(error));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
  res.render(`auth.ejs`);
});

Ws.io.on('connection', (socket) => {
  console.log('a user is connected');
  socket.on('chat message', (msg) => {
    Ws.io.emit('chat message', msg);
  });
});

app.get('/app', isLoggedIn, async (req: IGetUserAuthInfoRequest, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { id: req.user.id },
    relations: { workSpaces: true },
  });

  res.render('main.ejs', { user });
});

app.use('/api', routes);

server.listen(port, () => {
  console.log(`Express is listening at ${port}`);
});
