const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { groupBy, snakeCase } = require('lodash');

const colGap = 53;

// Left, top
const firstRow = [410, 368];
const secondRow = [986, 902];
const thirdRow = [410, 1436];

const width = 331;
const height = 490;

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

getImages('teams', 1); // gets all of the players excpet first player (who is highlighted)
getImages('first_players', 0, 0); // gets that first player

function getImages(folder, start = 0, end = 20) {
  const directoryPath = path.join(__dirname, `./${folder}`);

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const teamName = file.slice(0, -4);

      if (file === '.DS_Store') {
        continue;
      }

      for (let i = start; i <= end; i++) {
        let playerName = '';
        let left, top, itemLeft, player;
        if (i < 8) {
          [left, top] = firstRow;
          itemLeft = left + (width + colGap) * i;
          player = lineups[teamName][i];
        } else if (i < 13) {
          [left, top] = secondRow;
          itemLeft = left + (width + colGap) * (i - 8);
        } else {
          [left, top] = thirdRow;
          itemLeft = left + (width + colGap) * (i - 13);
          player = rotations[teamName][i - 13];
        }

        if (player) {
          playerName = `-${player.firstName.toLowerCase()}_${player.lastName.toLowerCase()}`;
        }

        sharp(`./${folder}/${file}`)
          .extract({ left: itemLeft, top, width, height })
          .toFile(`./updated/${teamName}-${i}${playerName}.png`, (err) => {
            console.log(err);
          });
      }
    }
  });
}
