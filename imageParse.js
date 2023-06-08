const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const { extras } = require("./other_linup.js");
const { groupBy, snakeCase, keys } = require("lodash");
const { DIRECTORIES, HEIGHT, WIDTH, CARD_SIZES } = require("./constants.js");

const VALID_IMG_TYPES = [".png", ".jpg", ".JPEG"];

function round(num) {
  return Math.round(num);
}

function parseCsv(file) {
  const content = fs.readFileSync(file, "utf8");
  return Papa.parse(content, {
    header: true,
  });
}

const game = "smb3";
const { gap, card, firstCard, row1, row2, row3 } = CARD_SIZES[game];
function getSizes(screenWidth, screenHeight) {
  const colGap = Math.floor((gap / WIDTH) * screenWidth);
  const firstRow = [
    round((row1.top / WIDTH) * screenWidth),
    round((row1.left / HEIGHT) * screenHeight),
  ]; // Left, top
  const secondRow = [
    round((row2.top / WIDTH) * screenWidth),
    round((row2.left / HEIGHT) * screenHeight),
  ];
  const thirdRow = [
    round((row3.top / WIDTH) * screenWidth),
    round((row3.left / HEIGHT) * screenHeight),
  ];
  const width = round((card.top / WIDTH) * screenWidth);
  const height = round((card.left / HEIGHT) * screenHeight);

  const first = {
    row: [
      round((firstCard.top / WIDTH) * screenWidth),
      round((firstCard.left / HEIGHT) * screenHeight),
    ],
    width: round((firstCard.width / WIDTH) * screenWidth),
    height: round((firstCard.height / HEIGHT) * screenHeight),
  };

  return { colGap, firstRow, secondRow, thirdRow, width, height, first };
}

function getTeams() {
  // index 0 - 7
  const lineups = groupBy(parseCsv("./lineups.csv").data, (o) =>
    snakeCase(o.teamName)
  );

  // index 13 - 16
  const rotations = groupBy(parseCsv("./rotations.csv").data, (o) =>
    snakeCase(o.teamName)
  );

  const teams = keys(lineups);

  // this is hacky as shit
  return teams.reduce((acc, team) => {
    const first = lineups[team]
      .slice(0, -1) // chop off starting pitcher
      .map((player) => `${player.firstName} ${player.lastName}`);
    const second = extras[team].slice(0, 5);
    const third = rotations[team].map(
      (player) => `${player.firstName} ${player.lastName}`
    );
    const fourth = extras[team].slice(5);
    acc[team] = [...first, ...second, ...third, ...fourth];
    return acc;
  }, {});
}

const teams = getTeams();
const makeCards = async (file, tmpDir) => {
  const fileMetadata = await sharp(
    path.join(__dirname, DIRECTORIES.uploads, file.originalname)
  ).metadata();
  const { colGap, firstRow, secondRow, thirdRow, width, height, first } =
    getSizes(+fileMetadata.width, +fileMetadata.height);

  const teamName = file.originalname.slice(0, -4);

  // loop player count
  return new Promise((resolve) => {
    for (let i = 0; i <= 20; i++) {
      const imgWidth = i === 0 ? first.width : width;
      const imgHeight = i === 0 ? first.height : height;

      let left, top, itemLeft;
      if (i < 8) {
        [left, top] = i === 0 ? first.row : firstRow;
        itemLeft = left + (imgWidth + colGap) * i;
      } else if (i < 13) {
        [left, top] = secondRow;
        itemLeft = left + (imgWidth + colGap) * (i - 8);
      } else {
        [left, top] = thirdRow;
        itemLeft = left + (imgWidth + colGap) * (i - 13);
      }

      const playerName = teams[teamName]
        ? teams[teamName][i].toLowerCase().replace(/ /gi, "_")
        : `player-${i}`;

      sharp(path.join(__dirname, DIRECTORIES.uploads, file.originalname))
        .extract({ left: itemLeft, top, width: imgWidth, height: imgHeight })
        .toFile(path.join(tmpDir, `${teamName}-${playerName}.png`), (err) => {
          if (err) console.log(err);
        });
    }

    resolve();
  });
};

const parseImages = (inputFolder) => {
  if (!inputFolder) {
    console.error(`No image directory entered`);
    return;
  }
  const directoryPath = path.join(__dirname, inputFolder);

  fs.readdir(directoryPath, async (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    const imageFiles = files.filter((el) =>
      VALID_IMG_TYPES.includes(path.extname(el))
    );

    // loop through team images
    for (let idx = 0; idx < imageFiles.length; idx++) {
      await makeCards(imageFiles[idx]);
    }
  });
};

module.exports = {
  makeCards,
  parseImages,
};
