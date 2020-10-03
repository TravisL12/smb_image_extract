const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const colGap = 53;

// Left, top
const firstRow = [410, 368];
const secondRow = [986, 902];
const thirdRow = [410, 1436];

const width = 331;
const height = 490;

function parseCsv(file) {
  const content = fs.readFileSync(file, 'utf8');
  Papa.parse(content, {
    header: true,
    complete: ({ data }) => {
      console.log(data);
    },
  });
}

parseCsv('./lineups.csv');
parseCsv('./rotations.csv');

getImages('teams', 1); // gets all of the players excpet first player (who is highlighted)
getImages('first_players', 0, 0); // gets that first player

function getImages(folder, start = 0, end = 20) {
  console.log(`start ${folder}`);
  const directoryPath = path.join(__dirname, `./${folder}`);

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    files.forEach(function (file) {
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

        sharp(`./${folder}/${file}`)
          .extract({ left: itemLeft, top, width, height })
          .toFile(`./updated/${file.slice(0, -4)}-${i}.png`, (err) => {
            console.log(err);
          });
      }
    });
  });
}
