const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { makeCards } = require('./imageParse.js');
const app = express();

const port = 8080;
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/parse', (req, res) => {
  parseImages(req.query.folder);
  res.send({ name: 'travis' });
});

//stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
  dest: './uploads',
});

app.post(
  '/upload',
  upload.single('file' /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(
      __dirname,
      `./uploads/${req.file.originalname}`
    );

    if (path.extname(req.file.originalname).toLowerCase() === '.png') {
      makeCards(req.file);
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);

        res.status(200).contentType('text/plain').end('File uploaded!');
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType('text/plain')
          .end('Only .png files are allowed!');
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
