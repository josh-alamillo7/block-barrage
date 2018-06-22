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

const swapBlockPositions = (grid, block) => {
  let colorTwo = block.colorTwo;
  let colorOne = block.colorOne;
  block.colorTwo = colorOne;
  block.colorOne = colorTwo;
  grid[[block.secBlockPosition + 1, block.column]] = colorOne;
  grid[[block.secBlockPosition, block.column]] = colorOne;
  grid[[block.secBlockPosition - 1, block.column]] = colorTwo;
  grid[[block.secBlockPosition - 2, block.column]] = colorTwo;
}

const moveBlockHoriz = (grid, block, direction) => {

  if (direction === 'left') {
    directionVector = -1
  } else {
    directionVector = 1
  }

  const newColumn = block.column + directionVector

  if (grid[[block.secBlockPosition + 1, newColumn]] !== 'silver') {
    console.log('you can\'t go ', direction)
    return
  }

  oldColumn = block.column
  block.column = newColumn;
  for (let row = block.secBlockPosition - 2; row <= block.secBlockPosition + 1; row++) {
    grid[[row, newColumn]] = grid[[row, oldColumn]]
    grid[[row, oldColumn]] = 'silver'
  }


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

  //******CHANGE THIS BACK!!! Temp 5-color game for bug-fixing*********
  // let possibleColors = ['white', 'green', 'blue', 'purple', 'pink']
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

  const colorOne = possibleColors[Math.floor(Math.random() * possibleColors.length)]
  let colorTwo = undefined
  let potentialColor

  while (colorTwo === undefined) {
    potentialColor = possibleColors[Math.floor(Math.random() * possibleColors.length)]
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
      currentBlock: {colorOne: null,
        colorTwo: null,
        column: null,
        secBlockPosition: null},
      droppedBlocks: [{color: currentBlock.colorOne, column: blockColumn, firstPos: lowestRow - 3, lastPos: lowestRow - 2}, 
      {color: currentBlock.colorTwo, column: blockColumn, firstPos: lowestRow - 1, lastPos: lowestRow}],
      action: 'score'
    }
  }

  lowerBlockOneSpot(grid, currentBlock);

  return {
    grid: grid,
    currentBlock: currentBlock,
    droppedBlocks: [],
    action: 'drop'
  }

}

const scoreGrid = (grid, multiplier, droppedBlocks, currentScore, height) => {

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
      const removedValue = this.storage[this.removeIndex];
      this.size--;
      delete this.storage[this.removeIndex];
      return removedValue
    } else if (this.size > 0) {
      const removedValue = this.storage[this.removeIndex];
      this.size--;
      delete this.storage[this.removeIndex];
      this.removeIndex++
      return removedValue
    }
  }

  const checkedPositions = {};
  const newDroppedBlocks = [];
  let colsToProcess = [];
  let removals = [];
  let score, color, rowValue, colValue, queue, currPosition, potentialRemovals;

  const outputScoreInfo = droppedBlocks.map(block => {
    color = grid[[block.firstPos,block.column]];
    score = 0;
    queue = new Queue();
    potentialRemovals = [];

    if (checkedPositions[[block.lastPos, block.column]] !== true) {
      queue.enqueue([block.lastPos, block.column])
      checkedPositions[[block.lastPos, block.column]] = true;
    } 
    if (grid[[block.lastPos + 1, block.column]] === color) {
      score++
    }
    if (grid[[block.firstPos - 1, block.column]] === color) {
      score++
    }
    while (queue.size > 0) {
      currPosition = queue.dequeue()
      potentialRemovals.push(currPosition)
      checkedPositions[currPosition] = true;
      rowValue = currPosition[0];
      colValue = currPosition[1];
      // console.log("CURRPOSITION", currPosition, "BOTTOM", grid[[rowValue + 1, colValue]], "TOP", grid[[rowValue - 1, colValue]])

      if (grid[[rowValue, colValue + 1]] === color && checkedPositions[[rowValue, colValue + 1]] !== true) {
        score++;
        queue.enqueue([rowValue, colValue + 1])
        checkedPositions[[rowValue, colValue + 1]] = true
      }
      if (grid[[rowValue, colValue - 1]] === color && checkedPositions[[rowValue, colValue - 1]] !== true) {
        score++;
        queue.enqueue([rowValue, colValue - 1])
        checkedPositions[[rowValue, colValue - 1]] = true
      } 
      if (grid[[rowValue - 1, colValue]] === color && checkedPositions[[rowValue - 1, colValue]] !== true) {
        queue.enqueue([rowValue - 1, colValue])
        checkedPositions[[rowValue - 1, colValue]] = true
      }    
      if (grid[[rowValue + 1, colValue]] === color && checkedPositions[[rowValue + 1, colValue]] !== true) {
        queue.enqueue([rowValue + 1, colValue])
        checkedPositions[[rowValue + 1, colValue]] = true
      }
    }
    if (score > 0) {
      removals = removals.concat(potentialRemovals)
    }
    return {
      color: color,
      score: score
    }
  }).filter(info => {
    return info.score > 0
  })
  //delete all positions marked for removal

  removals.forEach(removal => {
    grid[[removal[0],removal[1]]] = 'delete me'
    if (!colsToProcess.includes(removal[1])) {
      colsToProcess.push(removal[1])
    }
  })

  const moveAllColBlocksDownOne = (grid, row, column) => {
    let currRow = row
    while (grid[[currRow, column]] !== undefined && grid[[currRow, column]] !== 'silver') {
      if (grid[[currRow - 1, column]] === undefined) {
        grid[[currRow, column]] = 'silver'
      } else {
        grid[[currRow, column]] = grid[[currRow - 1, column]]
      } 
      currRow--    
    }
  }

  const addNewDroppedBlocks = (array, grid, row, column) => {
    let currRow = row;
    let newBlock = {};
    let previousColor = null;

    while(grid[[currRow, column]] !== 'delete me' && grid[[currRow, column]] !== 'silver' && grid[[currRow, column]] !== undefined) {
      if (grid[[currRow, column]] !== previousColor) {
        if (Object.keys(newBlock).length > 0) {
          array.push(newBlock);
        }
        newBlock = {}
        newBlock['firstPos'] = currRow;
        newBlock['lastPos'] = currRow;
        newBlock['color'] = grid[[currRow, column]];
        newBlock['column'] = column
        previousColor = grid[[currRow, column]];
      } else {
        newBlock['firstPos'] = currRow;
        array.push(newBlock);
        newBlock = {};
      }

      currRow--
    }

    if (Object.keys(newBlock).length > 0) {
      array.push(newBlock)
    }
    //if there is a newBlock, push it into the array
  }

  colsToProcess.reverse()

  colsToProcess.forEach(column => {
    let currRow = height - 1;


    while(grid[[currRow, column]] !== 'silver' && grid[[currRow, column]] !== undefined) {
      if (grid[[currRow, column]] === 'delete me') {
        while (grid[[currRow, column]] === 'delete me') {
          moveAllColBlocksDownOne(grid, currRow, column)
        }
        addNewDroppedBlocks(newDroppedBlocks, grid, currRow, column)
      }
      currRow--
    }  
  })
  //update the grid with new information
  //tell us which blocks will need to be considered in the next go-around.

  const addScore = outputScoreInfo.reduce((acc, item) => {
    return acc + item.score
  }, 0)


  if (addScore === 0) {
    return {
      grid: grid,
      scoreInfo: {
        crushDisplays: [],
        multiplier: 1,
        totalScore: currentScore
      },
      droppedBlocks: [],
      action: 'create'
    }
  } else {
    return {
      grid: grid,
      scoreInfo: {
        crushDisplays: outputScoreInfo,
        multiplier: multiplier + 1,
        totalScore: currentScore + (addScore * multiplier)
      },
      droppedBlocks: newDroppedBlocks,
      action: 'score'
    }
  } 

}

module.exports.return = returnMe;
module.exports.initializeGrid = initializeGrid;
module.exports.genNewBlock = genNewBlock;
module.exports.placeBlockAtPosition = placeBlockAtPosition;
module.exports.dropBlock = dropBlock;
module.exports.prettyGridPrint = prettyGridPrint;
module.exports.scoreGrid = scoreGrid;
module.exports.swapBlockPositions = swapBlockPositions;
module.exports.moveBlockHoriz = moveBlockHoriz;