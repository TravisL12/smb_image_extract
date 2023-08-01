const fs = require("fs");
const { RM_DIR_DELAY } = require("./constants.js");
const smb3_lineups = require("./smb_lineups/smb3_complete_lineup.json");
const smb4_lineups = require("./smb_lineups/smb4_complete_lineup.json");

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

const gameData = {
  smb3: { lineup: smb3_lineups, inputDir: "inputFiles/smb3_teams" },
  smb4: { lineup: smb4_lineups, inputDir: "inputFiles/smb4_teams" },
};

const round = (num) => Math.round(num);

module.exports = {
  randomName,
  deleteDirectory,
  deleteFile,
  round,
  gameData,
};
