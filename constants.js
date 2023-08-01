const DIRECTORIES = {
  uploads: "uploads",
  results: "slice_uploads",
  src: "src",
};
const VALID_IMG_TYPES = [".png", ".jpg", ".JPEG"];
const RM_DIR_DELAY = 5000;

const WIDTH = 3840;
const HEIGHT = 2160;

const CARD_SIZES = {
  smb3: {
    playerCount: 20,
    rowCount: 13,
    gap: 53,
    firstCard: { left: 405, top: 356, width: 345, height: 511 },
    card: { left: 331, top: 490 },
    row1: { left: 410, top: 368 },
    row2: { left: 986, top: 902 },
    row3: { left: 410, top: 1436 },
  },
  smb4: {
    playerCount: 22,
    rowCount: 14,
    gap: 70,
    firstCard: { left: 145, top: 335, width: 390, height: 440 },
    card: { left: 380, top: 430 }, // viewport size
    row1: { left: 155, top: 350 }, // shift viewport
    row2: { left: 600, top: 890 },
    row3: { left: 155, top: 1420 },
  },
};

module.exports = {
  DIRECTORIES,
  RM_DIR_DELAY,
  WIDTH,
  HEIGHT,
  CARD_SIZES,
  VALID_IMG_TYPES,
};
