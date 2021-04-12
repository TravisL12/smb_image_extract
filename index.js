const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { extras } = require('./other_linup.js');
const { groupBy, snakeCase, keys } = require('lodash');

// 1080p resolution (1920 x 1080)
// const colGap = 38;
// const firstRow = [410, 450]; // Left, top
// const secondRow = [895, 900];
// const thirdRow = [410, 1345];
// const width = 285;
// const height = 420;

// 4k resolution (3840 × 2160)
const colGap = 53;
const firstRow = [410, 368]; // Left, top
const secondRow = [986, 902];
const thirdRow = [410, 1436];
const width = 331;
const height = 490;

const first = {
  row: [405, 356],
  width: 345,
  height: 511,
  gap: 53,
};

function parseCsv(file) {
  const content = fs.readFileSync(file, 'utf8');
  return Papa.parse(content, {
    header: true,
  });
}

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

function getImages(folder, start = 0, end = 20) {
  const directoryPath = path.join(__dirname, `./${folder}`);

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    const imageFiles = files.filter((el) => path.extname(el) === '.png');
    for (let idx = 0; idx < imageFiles.length; idx++) {
      const file = imageFiles[idx];
      const teamName = file.slice(0, -4);

      for (let i = start; i <= end; i++) {
        const imgWidth = i === 0 ? first.width : width;
        const imgHeight = i === 0 ? first.height : height;
        const imgGap = i === 0 ? first.gap : colGap;

        let left, top, itemLeft;
        if (i < 8) {
          [left, top] = i === 0 ? first.row : firstRow;
          itemLeft = left + (imgWidth + imgGap) * i;
        } else if (i < 13) {
          [left, top] = secondRow;
          itemLeft = left + (imgWidth + imgGap) * (i - 8);
        } else {
          [left, top] = thirdRow;
          itemLeft = left + (imgWidth + imgGap) * (i - 13);
        }

        const playerName = total[teamName][i].toLowerCase().replace(/ /gi, '_');
        sharp(`./${folder}/${file}`)
          .extract({ left: itemLeft, top, width: imgWidth, height: imgHeight })
          .toFile(`./updated/${teamName}-${playerName}.png`, (err) => {
            if (err) console.log(err);
          });
      }
    }
  });
}

getImages('teams');
