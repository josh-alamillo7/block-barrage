const returnMe = (item) => {
  return item
}

const initializeGrid = (height, width) => {
  const output = {}

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      output[[i, j]] = 'grey'
    }
  }

  return output
}

module.exports.return = returnMe;
module.exports.initializeGrid = initializeGrid;