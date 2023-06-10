const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const { groupBy, snakeCase, keys } = require("lodash");

const { extras } = require("./smb3_lineups/other_linup.js");
const { DIRECTORIES, HEIGHT, WIDTH, CARD_SIZES } = require("./constants.js");
const smb4_lineups = require("./smb4_lineups.json");

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

function getSmb3Teams() {
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

const getSmb4Teams = () => {
  return smb4_lineups;
};

const game = "smb4";
const { gap, card, firstCard, row1, row2, row3, playerCount } =
  CARD_SIZES[game];
function getSizes(screenWidth, screenHeight) {
  const colGap = Math.floor((gap / WIDTH) * screenWidth);
  const firstRow = [
    round((row1.left / WIDTH) * screenWidth),
    round((row1.top / HEIGHT) * screenHeight),
  ]; // Left, top
  const secondRow = [
    round((row2.left / WIDTH) * screenWidth),
    round((row2.top / HEIGHT) * screenHeight),
  ];
  const thirdRow = [
    round((row3.left / WIDTH) * screenWidth),
    round((row3.top / HEIGHT) * screenHeight),
  ];
  const width = round((card.left / WIDTH) * screenWidth);
  const height = round((card.top / HEIGHT) * screenHeight);

  const first = {
    row: [
      round((firstCard.left / WIDTH) * screenWidth),
      round((firstCard.top / HEIGHT) * screenHeight),
    ],
    width: round((firstCard.width / WIDTH) * screenWidth),
    height: round((firstCard.height / HEIGHT) * screenHeight),
  };

  return { colGap, firstRow, secondRow, thirdRow, width, height, first };
}

const teams = getSmb4Teams();
const makeCards = async (file, outputPath) => {
  const sourceFilePath = path.join(
    __dirname,
    "support/smb4",
    file.originalname
  );
  const sourceFileMetadata = await sharp(sourceFilePath).metadata();
  const { colGap, firstRow, secondRow, thirdRow, width, height, first } =
    getSizes(+sourceFileMetadata.width, +sourceFileMetadata.height);

  const teamName = file.originalname.slice(0, -4);
  // loop player count
  return new Promise((resolve) => {
    for (let i = 0; i <= playerCount; i++) {
      const imgWidth = i === 0 ? first.width : width;
      const imgHeight = i === 0 ? first.height : height;

      let left, top, itemLeft;
      if (i < 8) {
        [left, top] = i === 0 ? first.row : firstRow;
        itemLeft = left + (imgWidth + colGap) * i;
      } else if (i < 14) {
        [left, top] = secondRow;
        itemLeft = left + (imgWidth + colGap) * (i - 8);
      } else {
        [left, top] = thirdRow;
        itemLeft = left + (imgWidth + colGap) * (i - 14);
      }

      const playerName = teams?.[teamName]?.[i] ?? `player-${i}`;

      sharp(sourceFilePath)
        .extract({ left: itemLeft, top, width: imgWidth, height: imgHeight })
        .toFile(path.join(outputPath, `${playerName}.png`), (err) => {
          if (err) console.log(err);
        });
    }

    resolve();
  });
};

const parseImages = (outputPath) => {
  const sourceFilesPath = path.join(__dirname, "support/smb4");

  fs.readdir(sourceFilesPath, async (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    const imageFiles = files.filter((el) =>
      VALID_IMG_TYPES.includes(path.extname(el))
    );

    // loop through team images
    for (let idx = 0; idx < imageFiles.length; idx++) {
      await makeCards({ originalname: imageFiles[idx] }, outputPath);
    }
  });
};

module.exports = {
  makeCards,
  parseImages,
};
