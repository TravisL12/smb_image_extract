const fs = require("fs");
const Papa = require("papaparse");
const { groupBy, snakeCase } = require("lodash");
const smb3Players = require("./smb3_players.json");

// index 0 - 7
const lineups = groupBy(parseCsv("./lineups.csv").data, (o) =>
  snakeCase(o.teamName)
);

// index 13 - 16
const rotations = groupBy(parseCsv("./rotations.csv").data, (o) =>
  snakeCase(o.teamName)
);

// first 5 are bench arr.slice(0,5)
// last four are relief pitchers arr.slice(5)

function parseCsv(file) {
  const content = fs.readFileSync(file, "utf8");
  return Papa.parse(content, {
    header: true,
  });
}

function outputFile(data) {
  fs.writeFile("./smb3_complete_lineup.json", JSON.stringify(data), (err) => {
    err;
  });
}

const benchPlayers = {
  beewolves: [
    "Benny Balmer",
    "Freddie Knox",
    "Steve Monstur",
    "Poke Foster",
    "Ruby Greene",
    "Tatts Balfour",
    "Benson Rushmore",
    "Dusty Winder",
    "Smack Avery",
  ],

  blowfish: [
    "Ricky Quan",
    "Hog Porker",
    "Harry Backman",
    "Alfonzo Delgado",
    "Pumper Lumpkins",
    "Geoffrey Jenkins",
    "Joanna Heater",
    "Mindy Marshwater",
    "Julio Huper",
  ],

  buzzards: [
    "Spits McKinny",
    "Emilio Idoya",
    "Ham Slamous",
    "Helena Bigsby",
    "Billy Bronx",
    "Sebastian Morrow",
    "Max Texis",
    "Meat Commonly",
    "Leyla Buckberger",
  ],

  crocodons: [
    "Trisha Lee",
    "Evan Chukov",
    "Clifford Kane",
    "Tarzan Woodburn",
    "Bubba Blastman",
    "Woody Ano",
    "Tia Mayfair",
    "Lou DaBaziz",
    "Ricky McFarland",
  ],

  freebooters: [
    "Kenna Quorn",
    "Kache Baskette",
    "Landon Fare",
    "Rocky Backstop",
    "Badhop Brown",
    "Steamboat Wisselle",
    "Grace Loopinovich",
    "Kay Frequin",
    "Ryder McPride",
  ],

  grapplers: [
    "Eduardo Electro",
    "Ben Kringer",
    "Jefe Manzano",
    "Biff Noggins",
    "Marla Moore",
    "Rallie Overro",
    "Mack Gunn",
    "Tucker Turlington",
    "Meggy Meggles",
  ],

  heaters: [
    "Kimme Smoke",
    "Maggie Rags",
    "Buscha Digman",
    "Bubbles Garcia",
    "Murky Nubswubbles",
    "Derr Neverwocker",
    "Splash Cashmore",
    "Huck Enduck",
    "Simba Delano",
  ],

  herbisaurs: [
    "Stevo Reeves",
    "Ralph Blue",
    "Chilli Little",
    "Nate Hanky",
    "Whopper Batsman",
    "Chuck Filthwick",
    "Leonar Ramiro",
    "Omar Chombo",
    "Elrick Rippin",
  ],

  hot_corners: [
    "Seymour Socks",
    "Nori Miyoshi",
    "Stu Berko",
    "Randy Mann",
    "Lars Stadkleef",
    "Joseph Broseph",
    "Amazo Haze",
    "Grump Everbright",
    "Sirloin Jones",
  ],

  jacks: [
    "Yoyo Yamamoto",
    "Batch Wilson",
    "Bruno Adamo",
    "Clutch Cormen",
    "Betty Sparks",
    "Immaculo Spectaculo",
    "Ellain Munstar",
    "Kisha Musharra",
    "Chico Lapada",
  ],

  moonstars: [
    "Dale Nale",
    "Clubber Buff",
    "Elija Gobbleson",
    "Raffy Slaps",
    "Clyde Oliver",
    "Deft Weddums",
    "Bert Bergerer",
    "Taylor McWhales",
    "Lil Bupton",
  ],

  moose: [
    "Hose Tremendo",
    "Stallion Johnson",
    "Lionel Martinez",
    "Wiggles Freeman",
    "Pedro Nixon",
    "Felix Farmhand",
    "Charlie Best",
    "Carla Tolbert",
    "Klaus D'Gayme",
  ],

  nemesis: [
    "Churl Dangerfield",
    "Flash Leathar",
    "Amy Zoner",
    "Mimori Aoshima",
    "Gabby Ganez",
    "Binky Stevens",
    "Lucy Finnegans",
    "Babette Walkman",
    "Lawrence Wimple",
  ],

  overdogs: [
    "Casper Stern",
    "Samuel Perez",
    "Dick Burger",
    "Raphael Gonzolo",
    "Digg Efforto",
    "Brawn Thunderchump",
    "David Diggler",
    "Rocket Ramon",
    "Doug Nerdwerd",
  ],

  platypi: [
    "Linda Hand",
    "Kerry Cartman",
    "Chase Tibuhle",
    "Rory Crowds",
    "Sky Rodriguez",
    "Chance Lotterbury",
    "Remington Sharp",
    "Hugh Jacobs",
    "Walt Huckster",
  ],

  sand_cats: [
    "Kara Kawaguchi",
    "Winston Draper",
    "Tigg Tantrum",
    "Gia Axelson",
    "Stracy Wickers",
    "Maverick McMann",
    "Gasser Morris",
    "Jemma Yago",
    "Ice Vainer",
  ],

  sawteeth: [
    "Hanso Magikko",
    "Cathy Culdesac",
    "Pex Flext",
    "Mattie Batts",
    "Sammie Shigetani",
    "Brick Towers",
    "Doc Simpleman",
    "Libby Doe",
    "Maximo Primo",
  ],

  sirloins: [
    "Tish Balin",
    "Boomer Plattune",
    "Momo Tobo",
    "Javier Cortez",
    "Mick Steeyle",
    "Shay Dee",
    "Miguel Duke",
    "Linus Digby",
    "Franz Zilla",
  ],

  wideloads: [
    "Izzy Baker",
    "Darcy Hicks",
    "Prince Prize",
    "Olaf Beerson",
    "Jules Bergman",
    "Bale Bozzer",
    "Molly Pops",
    "Kyrone Throne",
    "Rogan Balls",
  ],

  wild_pigs: [
    "Wally Bacon",
    "Godfried Storm",
    "Enrique Goyo",
    "Turbo Miles",
    "Earnie Blings",
    "Donovan Drake",
    "Alana Lantana",
    "Kendra Kerr",
    "Hander O'Speciallo",
  ],
};

const findPlayer = (playerName) => {
  const nameSplit = playerName.split(" ");
  return smb3Players.find((p) => {
    const firstNameMatch = p.firstName === nameSplit[0];
    const lastNameMatch = p.lastName === nameSplit[1];
    return firstNameMatch && lastNameMatch;
  });
};

const generate = () => {
  const teamNames = Object.keys(lineups);
  const output = teamNames.reduce((acc, teamName) => {
    const team = [];

    // first row
    lineups[teamName].slice(0, -1).forEach((player) => {
      const { id, firstName, lastName } = player;
      team.push({ id, firstName, lastName });
    });

    // second row (not pitchers)
    benchPlayers[teamName].slice(0, 5).forEach((playerName) => {
      const player = findPlayer(playerName);
      if (player) {
        const { localID, firstName, lastName } = player;
        team.push({ id: String(localID), firstName, lastName });
      }
    });

    // third row (starting pitchers)
    rotations[teamName].forEach((player) => {
      const { id, firstName, lastName } = player;
      team.push({ id, firstName, lastName });
    });

    // second row (not pitchers)
    benchPlayers[teamName].slice(5).forEach((playerName) => {
      const player = findPlayer(playerName);
      if (player) {
        const { localID, firstName, lastName } = player;
        team.push({ id: String(localID), firstName, lastName });
      }
    });

    acc[teamName] = team;
    return acc;
  }, {});

  outputFile(output);
  return output;
};

generate();

module.exports = { benchPlayers };
