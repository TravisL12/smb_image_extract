const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { extras } = require('./other_linup.js');
const { groupBy, snakeCase, keys } = require('lodash');

function round(num) {
  return Math.round(num);
}

function parseCsv(file) {
  const content = fs.readFileSync(file, 'utf8');
  return Papa.parse(content, {
    header: true,
  });
}

const DIMENSIONS = {
  // 1080p resolution (1920 x 1080)
  low: {
    screenWidth: 1920,
    screenHeight: 1080,
    inputFolder: 'teams_1080',
  },
  // 4k resolution (3840 × 2160)
  high: {
    screenWidth: 3840,
    screenHeight: 2160,
    inputFolder: 'teams',
  },
};

function getSizes(screenWidth, screenHeight) {
  const colGap = Math.floor((53 / 3840) * screenWidth);
  const firstRow = [
    round((410 / 3840) * screenWidth),
    round((368 / 2160) * screenHeight),
  ]; // Left, top
  const secondRow = [
    round((986 / 3840) * screenWidth),
    round((902 / 2160) * screenHeight),
  ];
  const thirdRow = [
    round((410 / 3840) * screenWidth),
    round((1436 / 2160) * screenHeight),
  ];
  const width = round((331 / 3840) * screenWidth);
  const height = round((490 / 2160) * screenHeight);

  const first = {
    row: [
      round((405 / 3840) * screenWidth),
      round((356 / 2160) * screenHeight),
    ],
    width: round((345 / 3840) * screenWidth),
    height: round((511 / 2160) * screenHeight),
  };

  return { colGap, firstRow, secondRow, thirdRow, width, height, first };
}

function start(dimension) {
  if (!dimension) return;
  const { screenWidth, screenHeight, inputFolder } = DIMENSIONS[dimension];

  const {
    colGap,
    firstRow,
    secondRow,
    thirdRow,
    width,
    height,
    first,
  } = getSizes(screenWidth, screenHeight);

  // index 0 - 7
  const lineups = groupBy(parseCsv('./lineups.csv').data, (o) =>
    snakeCase(o.teamName)
  );

  // index 13 - 16
  const rotations = groupBy(parseCsv('./rotations.csv').data, (o) =>
    snakeCase(o.teamName)
  );

  const teams = keys(lineups);

  // this is hacky as shit
  const total = teams.reduce((acc, team) => {
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

  const directoryPath = path.join(__dirname, `./${inputFolder}`);

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    const imageFiles = files.filter((el) =>
      ['.png', 'jpg', 'JPEG'].includes(path.extname(el))
    );
    for (let idx = 0; idx < imageFiles.length; idx++) {
      const file = imageFiles[idx];
      const teamName = file.slice(0, -4);

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

        const playerName = total[teamName][i].toLowerCase().replace(/ /gi, '_');
        sharp(`./${inputFolder}/${file}`)
          .extract({ left: itemLeft, top, width: imgWidth, height: imgHeight })
          .toFile(`./updated/${teamName}-${playerName}.png`, (err) => {
            if (err) console.log(err);
          });
      }
    }
  });
}

start('high');
