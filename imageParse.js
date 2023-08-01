const sharp = require("sharp");
const path = require("path");
const { snakeCase } = require("lodash");

const { HEIGHT, WIDTH, CARD_SIZES, SMB4 } = require("./constants.js");
const { round, gameData } = require("./helper");

const game = SMB4;

function getSizes(screenWidth, screenHeight) {
  const { gap, card, firstCard, row1, row2, row3 } = CARD_SIZES[game];

  const colGap = Math.floor((gap / WIDTH) * screenWidth);
  const firstRow = [
    round((row1.left / WIDTH) * screenWidth),
    round((row1.top / HEIGHT) * screenHeight),
  ];
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

const makeCards = async (file, outputPath) => {
  const { playerCount, rowCount } = CARD_SIZES[game];
  const { lineup: teams, inputDir } = gameData[game];

  const sourceFilePath = path.join(__dirname, inputDir, file.originalname);
  const sourceFileMetadata = await sharp(sourceFilePath).metadata();

  const { colGap, firstRow, secondRow, thirdRow, width, height, first } =
    getSizes(+sourceFileMetadata.width, +sourceFileMetadata.height);

  const teamName = snakeCase(file.originalname.slice(0, -4));
  // loop player count
  return new Promise((resolve) => {
    for (let i = 0; i <= playerCount; i++) {
      const imgWidth = i === 0 ? first.width : width;
      const imgHeight = i === 0 ? first.height : height;

      let left, top, itemLeft;
      if (i < 8) {
        [left, top] = i === 0 ? first.row : firstRow;
        itemLeft = left + (imgWidth + colGap) * i;
      } else if (i < rowCount) {
        [left, top] = secondRow;
        itemLeft = left + (imgWidth + colGap) * (i - 8);
      } else {
        [left, top] = thirdRow;
        itemLeft = left + (imgWidth + colGap) * (i - rowCount);
      }

      const playerName = teams?.[teamName]
        ? teams?.[teamName]?.[i]?.id
        : `player-${i}`;

      if (!teams?.[teamName]) {
        console.log(teamName, "MISSING TEAM");
      }

      sharp(sourceFilePath)
        .extract({ left: itemLeft, top, width: imgWidth, height: imgHeight })
        .toFile(path.join(outputPath, `${playerName}.png`), (err) => {
          if (err) console.log(err);
        });
    }

    resolve();
  });
};

module.exports = {
  makeCards,
};
