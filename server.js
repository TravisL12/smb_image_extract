const express = require('express');
const path = require('path');
const { parseImages } = require('./imageParse.js');
const app = express();

const port = 8080;
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/parse', function (req, res) {
  parseImages(req.query.folder);
  res.send({ name: 'travis' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
