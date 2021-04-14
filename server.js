const express = require('express');
const path = require('path');
const app = express();

// app.use(express.static(path.join(__dirname, 'src')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});
const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
