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

const genNewBlock = (grid, width) => {
  //choose a random column and check its color
  let checked = {};
  let newBlock = {};
  let randomNumber

  while (Object.keys(checked).length < width) {
    randomNumber = Math.floor(Math.random() * width)
    console.log(randomNumber)
    checked[randomNumber] = true
  }

  return grid
}

genNewBlock({}, 4)

module.exports.return = returnMe;
module.exports.initializeGrid = initializeGrid;
module.exports.genNewBlock = genNewBlock;