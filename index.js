const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { extras } = require('./other_linup.js');
const { groupBy, snakeCase, keys } = require('lodash');

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
// console.log(total);
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
        let left, top, itemLeft;
        if (i < 8) {
          [left, top] = firstRow;
          itemLeft = left + (width + colGap) * i;
        } else if (i < 13) {
          [left, top] = secondRow;
          itemLeft = left + (width + colGap) * (i - 8);
        } else {
          [left, top] = thirdRow;
          itemLeft = left + (width + colGap) * (i - 13);
        }

        const playerName = total[teamName][i].toLowerCase().replace(/ /gi, '_');
        sharp(`./${folder}/${file}`)
          .extract({ left: itemLeft, top, width, height })
          .toFile(`./updated/${teamName}-${playerName}.png`, (err) => {
            console.log(err);
          });
      }
    }
  });
}
