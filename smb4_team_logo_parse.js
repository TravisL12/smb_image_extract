const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { snakeCase } = require("lodash");
const { DIRECTORIES } = require("./constants");

const inputDir = "input_files/smb4_team_logos";

const makeSmb4TeamLogos = async (file, outputPath) => {
  const sourceFilePath = path.join(__dirname, inputDir, file.originalname);
  // const sourceFileMetadata = await sharp(sourceFilePath).metadata();
  const teamName = snakeCase(file.originalname.slice(0, -4));

  // loop player count
  return new Promise((resolve) => {
    sharp(sourceFilePath)
      .extract({ left: 1940, top: 185, width: 680, height: 680 })
      .toFile(path.join(outputPath, `${teamName}.png`), (err) => {
        if (err) console.log(err);
      });

    resolve();
  });
};

const parseLogoImages = (outputPath) => {
  const sourceFilesPath = path.join(__dirname, inputDir);

  fs.readdir(sourceFilesPath, async (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    // loop through team images
    for (let idx = 0; idx < files.length; idx++) {
      await makeSmb4TeamLogos({ originalname: files[idx] }, outputPath);
    }
  });
};

const tmpDir = path.join(__dirname, DIRECTORIES.uploads, `smb4_team_logos`);
fs.mkdirSync(tmpDir);
parseLogoImages(tmpDir);

// module.exports = { parseLogoImages, makeSmb4TeamLogos };
