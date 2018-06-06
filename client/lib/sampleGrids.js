const helpers = require('./helpers')

const startingGridHeight = 8
let firstGrid = helpers.initializeGrid(startingGridHeight, 4)
let secondGrid = helpers.initializeGrid(startingGridHeight, 4)
let thirdGrid = helpers.initializeGrid(startingGridHeight, 4)

const fillColumn = (grid, height, column) => {
  for (let x = 3; x < height; x++) {
    grid[[x,column]] = 'red'
  }
}

const fillColumnAlmostHalfway = (grid, height, column) => {
  for (let x = height/2 + 1; x < height; x++) {
    grid[[x,column]] = 'green'
  }
}

for (let y = 0; y < 3; y++) {
  fillColumn(firstGrid, startingGridHeight, y)
  fillColumn(secondGrid, startingGridHeight, y)
}

fillColumn(secondGrid, startingGridHeight, 3)
fillColumnAlmostHalfway(thirdGrid, startingGridHeight, 0)

module.exports.threeColumnsFilledGrid = firstGrid;
module.exports.allColumnsFilledGrid = secondGrid;
module.exports.firstColumnAlmostHalfFilledGrid = thirdGrid;