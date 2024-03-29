const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const { makeCards } = require("./imageParse.js");
const { randomName, deleteDirectory, deleteFile } = require("./helper.js");
const { DIRECTORIES, VALID_IMG_TYPES } = require("./constants.js");

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, DIRECTORIES.client)));
app.use(express.static(path.join(__dirname, DIRECTORIES.results)));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, DIRECTORIES.client, "index.html"));
});

app.get("/parse", (req, res) => {
  const outputDir = path.join(
    __dirname,
    DIRECTORIES.outputFiles,
    `smb4_player_imgs`
  );
  fs.mkdirSync(outputDir);

  app.use(express.static(outputDir));

  fs.readdir(path.join(__dirname, inputDir), async (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    const imageFiles = files.filter((el) =>
      VALID_IMG_TYPES.includes(path.extname(el))
    );

    // loop through team images
    for (let idx = 0; idx < imageFiles.length; idx++) {
      await makeCards({ originalname: imageFiles[idx] }, outputDir);
    }
  });
  res.send({ name: "all done!" });
});

//stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
  dest: path.join(__dirname, DIRECTORIES.outputFiles),
});

app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    try {
      const tempPath = req.file.path;
      const targetPath = path.join(
        __dirname,
        DIRECTORIES.outputFiles,
        req.file.originalname
      );
      if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        const outputDir = path.join(__dirname, `teamOutput/${randomName()}`);
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

          deleteFile(targetPath);
          // DELETE UPLOAD FOLDER!
          // deleteDirectory(outputDir);
        });
      } else {
        deleteFile(targetPath);
      }
    } catch (err) {
      res.status(500).end(err);
    }
  }
);
