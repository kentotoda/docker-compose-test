const app = require('express')();
console.log("START");
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(3000, () => console.log('LISTEN:3000 on docker'));
