const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { makeCards, parseImages } = require("./imageParse.js");
const { randomName, deleteDirectory } = require("./helper.js");
const { DIRECTORIES } = require("./constants.js");
const app = express();

const port = 8080;
app.use(express.static(path.join(__dirname, DIRECTORIES.src)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, DIRECTORIES.src, "index.html"));
});

app.get("/parse", (req, res) => {
  const outputDir = path.join(__dirname, DIRECTORIES.uploads, `smb4_output`);
  fs.mkdirSync(outputDir);

  app.use(express.static(outputDir));

  parseImages(outputDir);
  res.send({ name: "travis" });
});

//stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
  dest: path.join(__dirname, DIRECTORIES.uploads),
});

app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    try {
      const tempPath = req.file.path;
      const targetPath = path.join(
        __dirname,
        DIRECTORIES.uploads,
        req.file.originalname
      );
      if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        const outputDir = path.join(__dirname, `output/${randomName()}`);
        fs.mkdirSync(outputDir);

        app.use(express.static(outputDir));

        fs.rename(tempPath, targetPath, async (err) => {
          if (err) return handleError(err, res);
          await makeCards(req.file, outputDir);
          fs.readdir(path.join(outputDir), {}, (_, files) => {
            const urls = files.filter(
              (file) => path.extname(file).toLowerCase() === ".png"
            );
            res.send(urls);
          });

          // DELETE UPLOAD FOLDER!
          // deleteDirectory(outputDir);
        });
      } else {
        fs.unlink(tempPath, (err) => {
          if (err) return handleError(err, res);

          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
      }
    } catch (err) {
      res.status(500).end(err);
    }
  }
);

app.use(express.static(path.join(__dirname, DIRECTORIES.results)));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
