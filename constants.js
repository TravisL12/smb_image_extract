const DIRECTORIES = {
  uploads: "uploads",
  results: "slice_uploads",
  src: "src",
};

const RM_DIR_DELAY = 5000;

const WIDTH = 3840;
const HEIGHT = 2160;

const CARD_SIZES = {
  smb3: {
    gap: 53,
    firstCard: { top: 405, left: 356, width: 345, height: 511 },
    card: { top: 331, left: 490 },
    row1: { top: 410, left: 368 },
    row2: { top: 986, left: 902 },
    row3: { top: 410, left: 1436 },
  },
  smb4: {},
};

module.exports = {
  DIRECTORIES,
  RM_DIR_DELAY,
  WIDTH,
  HEIGHT,
  CARD_SIZES,
};
