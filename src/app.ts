import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`swagger coming soon..`);
});

app.listen(port, () => {
  console.log(`Express is listening at ${port}`);
});

export default app;
