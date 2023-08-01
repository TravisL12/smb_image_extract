const fs = require("fs");
const { RM_DIR_DELAY } = require("./constants.js");

const letters = "abcdefghijklmnopqrstuvwxyz";
const randomName = () => {
  let word = "";
  for (let i = 0; i < 10; i++) {
    word += letters[Math.floor(Math.random() * letters.length)];
  }
  return word;
};

// DELETE UPLOAD FOLDER!
const deleteDirectory = (tmpDirectory) => {
  setTimeout(() => {
    fs.rm(tmpDirectory, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
      console.log(`${tmpDirectory} is deleted!`);
    });
  }, RM_DIR_DELAY);
};

const deleteFile = (filePath) => {
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }

      console.log(`${filePath} File deleted`);
    });
  }, RM_DIR_DELAY);
};

module.exports = {
  randomName,
  deleteDirectory,
  deleteFile,
};
