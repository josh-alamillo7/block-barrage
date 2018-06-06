const returnMe = (item) => {
  return item
}

const initializeGrid = (height, width) => {
  const output = {}

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      output[[i, j]] = 'silver'
    }
  }

  return output
}

const createBlockOnTop = (grid, column, newBlock, colorOne, colorTwo) => {
  newBlock['colorOne'] = colorOne;
  newBlock['colorTwo'] = colorTwo;
  grid[[0,column]] = colorOne;
  grid[[1,column]] = colorOne;
  grid[[2,column]] = colorTwo;
  grid[[3,column]] = colorTwo;
}

const placeBlockAtPosition = (grid, block) => {

  grid[[block.secBlockPosition - 3,block.column]] = block.colorOne;
  grid[[block.secBlockPosition - 2,block.column]] = block.colorOne;
  grid[[block.secBlockPosition - 1,block.column]] = block.colorTwo;
  grid[[block.secBlockPosition,block.column]] = block.colorTwo;
}

const lowerBlockOneSpot = (grid, block) => {
  grid[[block.secBlockPosition - 3,block.column]] = 'silver';
  grid[[block.secBlockPosition - 1,block.column]] = block.colorOne;
  grid[[block.secBlockPosition + 1,block.column]] = block.colorTwo;
  block.secBlockPosition += 1
}

const checkIfBlockCanDrop = (grid, column, lowestRow) => {
  let rowToCheck = lowestRow + 1
  return grid[[rowToCheck,column]] === 'silver'
}

const genNewBlock = (grid, width) => {
  //choose a random column and check its color
  let checked = {};
  let newBlock = {};
  let possibleColors = ['red', 'white', 'black', 'green', 'yellow', 'blue', 'orange']
  let randomColumn;

  while (Object.keys(checked).length < width) {
    randomColumn = Math.floor(Math.random() * width)
    if (grid[[3,randomColumn]] === 'silver') {
      newBlock['column'] = randomColumn
      newBlock['secBlockPosition'] = 2
      break
    }
    checked[randomColumn] = true
  }

  if (newBlock['column'] === undefined) {
    return {
      grid: grid,
      newBlock: null,
      action: 'gameOver'
    }
  }

  const colorOne = possibleColors[Math.floor(Math.random() * 7)]
  let colorTwo = undefined
  let potentialColor

  while (colorTwo === undefined) {
    potentialColor = possibleColors[Math.floor(Math.random() * 7)]
    if (potentialColor !== colorOne) {
      colorTwo = potentialColor
    }
  }

  createBlockOnTop(grid, randomColumn, newBlock, colorOne, colorTwo)

  return {
    grid: grid,
    newBlock: newBlock,
    action: 'drop'
  }
}

const dropBlock = (grid, currentBlock) => {

  const blockColumn = currentBlock['column'];
  const lowestRow = currentBlock['secBlockPosition'];

  if (!checkIfBlockCanDrop(grid, blockColumn, lowestRow)) {
    return {
      grid: grid,
      currentBlock: currentBlock,
      action: 'score'
    }
  }

  lowerBlockOneSpot(grid, currentBlock);

  return {
    grid: grid,
    currentBlock: currentBlock,
    action: 'drop'
  }

}

module.exports.return = returnMe;
module.exports.initializeGrid = initializeGrid;
module.exports.genNewBlock = genNewBlock;
module.exports.placeBlockAtPosition = placeBlockAtPosition;
module.exports.dropBlock = dropBlock;