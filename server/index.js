const app = require('express')();

const PORT = 3000;

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.get('/items', (req, res) => {
  res.send([
    'hoge', 'huga'
  ]);
});

app.listen(PORT, () => console.log(`LISTEN:${PORT} on docker`));
