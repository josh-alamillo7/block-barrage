const { Queue } = require('./queue');

const returnMe = (item) => {
  return item
}

const initializeGrid = (height, width) => {
//Initialize a blank grid, for use with tests and to start the initial game grid.
  const output = {}

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      output[[i, j]] = 'silver'
    }
  }

  return output
}

const prettyGridPrint = (grid, height, width) => {
//Prints a grid into the terminal. Used by tests for easier debugging.
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
  //Happens when new block properties are decided on by genNewBlock. 
  //Takes in a grid and new block information to create a new block and updates the grid
  //accordingly.
  newBlock['colorOne'] = colorOne;
  newBlock['colorTwo'] = colorTwo;
  grid[[0,column]] = colorOne;
  grid[[1,column]] = colorOne;
  grid[[2,column]] = colorTwo;
  grid[[3,column]] = colorTwo;
}

const placeBlockAtPosition = (grid, block) => {
  //Used by tests to simplify placing blocks on test grids.
  grid[[block.secBlockPosition - 2,block.column]] = block.colorOne;
  grid[[block.secBlockPosition - 1,block.column]] = block.colorOne;
  grid[[block.secBlockPosition,block.column]] = block.colorTwo;
  grid[[block.secBlockPosition + 1,block.column]] = block.colorTwo;
}

const lowerBlockOneSpot = (grid, block) => {
  //used by the drop function. Takes in block information and lowers that block one 
  //row, updating the game grid accordingly.
  grid[[block.secBlockPosition - 2,block.column]] = 'silver';
  grid[[block.secBlockPosition,block.column]] = block.colorOne;
  grid[[block.secBlockPosition + 2,block.column]] = block.colorTwo;
  block.secBlockPosition += 1
}

const swapBlockPositions = (grid, block) => {
  //used for the player space keydown effect. Takes in a block, swapping its color positions.
  //Updates the game grid accordingly.
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

  //used for the player left/right arrow keydown effect. Takes in a block, checks if it
  //can move that direction, and if it can, moves the block in that direction. Updates
  //the game grid accordingly.

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

  //returns a boolean representing whether the block is able to drop one spot; that is,
  //it will return false if the block already has a block before it, or if the block
  //is at the bottom of the grid.
  
  let rowToCheck = lowestRow + 1
  return grid[[rowToCheck,column]] === 'silver'
}

const genNewBlock = (grid, width) => {
  //finds an available column that can fit a new block, and if there is one available,
  //generates a new block at the top of that column. If there are no rows available,
  //it returns a game over state.
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

  const colorOne = possibleColors[Math.floor(Math.random() * possibleColors.length)]
  let colorTwo = undefined
  let potentialColor;

  while (colorTwo === undefined) {
    potentialColor = possibleColors[Math.floor(Math.random() * possibleColors.length)]
    if (potentialColor !== colorOne) {
      colorTwo = potentialColor
    }
  }

  createBlockOnTop(grid, randomColumn, newBlock, colorOne, colorTwo);

  return {
    grid: grid,
    newBlock: newBlock,
    action: 'drop'
  }
}

const genCrusher = (grid, width, height) => {
  //generates a crusher on a random column, initializing its position to be directly on
  //top of the highest existing block on that column.
  let rowPointer = -1;
  const randomColumn = Math.floor(Math.random() * width);

  while (rowPointer < height - 1) {
    if (grid[[rowPointer + 1, randomColumn]] !== 'silver') {
      break
    }
    rowPointer++;
  }

  return {
    column: randomColumn,
    currRow: rowPointer,
    firstUncrushedRow: height - 1
  }
}

const dropBlock = (grid, currentBlock) => {
  
  //checks if a block can drop. If it can, it drops the block one spot on that column.
  //Otherwise, tells the game to start scoring.
  
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

const scoreGrid = (grid, multiplier, droppedBlocks, currentScore, height, width, nextCrusherScore) => {

  //takes in an array of droppedBlocks, and does a breadth-first search from each of those
  //blocks to find all matching colors.
  //It marks all of these matched color blocks for deletion, keeps track of the score info,
  //then column-by-column, deletes the color blocks marked for deletion.
  //Every time a block is "deleted", the blocks above it are dropped, and all must now
  //be checked in the next scoring iteration, so they are added to droppedBlocks.
  
  //if there were no dropped blocks the game is done scoring.
    //if the player has reached the next score threshold for getting a crusher, the game
    //returns a crush action.
    //Otherwise, the function tells the game to generate a new block.

  const checkedPositions = {};
  const newDroppedBlocks = [];
  let colsToProcess = [];
  let removals = [];
  let score, color, rowValue, colValue, queue, currPosition, potentialRemovals;

  const outputScoreInfo = droppedBlocks.map(block => {
    color = grid[[block.firstPos,block.column]];
    score = 0;
    console.log(Queue)
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

  const totalScore = currentScore + (addScore * multiplier);

  if (addScore === 0) {
    if (totalScore >= nextCrusherScore) {
      //generate crusher function
      return {
        grid: grid,
        nextCrusherScore: nextCrusherScore + 40,
        scoreInfo: {
          crushDisplays: [],
          multiplier: 1,
          totalScore: currentScore
        },
        crusher: genCrusher(grid, width, height),
        droppedBlocks: [],
        action: 'crush'
      }
    }
    return {
      grid: grid,
      nextCrusherScore: nextCrusherScore,
      scoreInfo: {
        crushDisplays: [],
        multiplier: 1,
        totalScore: currentScore
      },
      crusher: {
        column: null,
        currRow: null,
        firstUncrushedRow: null
      },
      droppedBlocks: [],
      action: 'create'
    }
  } else {
    return {
      grid: grid,
      nextCrusherScore: nextCrusherScore,
      scoreInfo: {
        crushDisplays: outputScoreInfo,
        multiplier: multiplier + 1,
        totalScore: currentScore + (addScore * multiplier)
      },
      crusher: {
        column: null,
        currRow: null,
        firstUncrushedRow: null
      },
      droppedBlocks: newDroppedBlocks,
      action: 'score'
    }
  } 

}

const crushLowestBlock = (grid, startRow, endRow, column) => {

  //finds the lowest block taking up more than two rows, reduces it to one row, and drops
  //all blocks above it.

  for (let row = startRow; row > endRow; row--) {
    if (row === 0) {
      grid[[row, column]] = 'silver'
    } else {
      grid[[row, column]] = grid[[row - 1, column]]
    }    
  }
}

const crushColumn = (grid, crusher, droppedBlocks) => { 
  //takes in a column and, one by one, crushes all two-row blocks into one-row blocks.
  //all blocks in the new column must now be checked for scoring, so the function always
  //returns a score action with the crushed blocks as droppedBlocks.

  let rowPointer = crusher.firstUncrushedRow;
  const crusherColumn = crusher.column;
  const crusherRow = crusher.currRow;

  while(rowPointer > crusherRow) {
    if (grid[[rowPointer, crusherColumn]] === grid[[rowPointer - 1, crusherColumn]]) {
      crushLowestBlock(grid, rowPointer, crusher.currRow, crusherColumn)
      droppedBlocks.push({firstPos: rowPointer, lastPos: rowPointer, column: crusherColumn, color: grid[[rowPointer, crusherColumn]]})
      return {
        grid: grid,
        action: 'crush',
        crusher: {
          column: crusherColumn,
          currRow: crusherRow + 1,
          firstUncrushedRow: rowPointer - 1 
        },
        droppedBlocks: droppedBlocks
      }
    }
    droppedBlocks.push({firstPos: rowPointer, lastPos: rowPointer, column: crusherColumn, color: grid[[rowPointer, crusherColumn]]})
    rowPointer--
  }

  return {
    grid: grid,
    action: 'score',
    crusher: {
      column: null,
      currRow: null,
      firstUncrushedRow: null
    },
    droppedBlocks: droppedBlocks
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
module.exports.crushLowestBlock = crushLowestBlock;
module.exports.crushColumn = crushColumn;