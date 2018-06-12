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

const prettyGridPrint = (grid, height, width) => {
  let string = ''

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      string += ' ' + grid[[i,j]]
    }
    string += '\n'
    if (i % 2 === 1) {
      string += '------------------\n'
    }
  }

  console.log(string)
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

  grid[[block.secBlockPosition - 2,block.column]] = block.colorOne;
  grid[[block.secBlockPosition - 1,block.column]] = block.colorOne;
  grid[[block.secBlockPosition,block.column]] = block.colorTwo;
  grid[[block.secBlockPosition + 1,block.column]] = block.colorTwo;
}

const lowerBlockOneSpot = (grid, block) => {
  grid[[block.secBlockPosition - 2,block.column]] = 'silver';
  grid[[block.secBlockPosition,block.column]] = block.colorOne;
  grid[[block.secBlockPosition + 2,block.column]] = block.colorTwo;
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
  const lowestRow = currentBlock['secBlockPosition'] + 1;

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

const Queue = function() {
  this.storage = {};
  this.addIndex = 0;
  this.removeIndex = 0;
  this.size = 0;
}

Queue.prototype.enqueue = function(value) {
  this.storage[this.addIndex] = value;
  this.addIndex++
  this.size++
}

Queue.prototype.dequeue = function() {
  if (this.removeIndex === this.addIndex && this.size > 0) {
    removedValue = this.storage[this.removeIndex];
    this.size--;
    delete this.storage[this.removeIndex];
    return removedValue
  } else if (this.size > 0) {
    removedValue = this.storage[this.removeIndex];
    this.size--;
    delete this.storage[this.removeIndex];
    this.removeIndex++
    return removedValue
  }
}


const scoreGrid = (grid, multiplier, droppedBlocks) => {

  checkedPositions = {};
  let score = 0;
  let color = 0;

  //block should be in the format row, column
  droppedBlocks.forEach(block => {
    color = grid[[block[0],block[1]]]

  })

}

module.exports.return = returnMe;
module.exports.initializeGrid = initializeGrid;
module.exports.genNewBlock = genNewBlock;
module.exports.placeBlockAtPosition = placeBlockAtPosition;
module.exports.dropBlock = dropBlock;
module.exports.prettyGridPrint = prettyGridPrint;