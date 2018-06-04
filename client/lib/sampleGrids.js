const helpers = require('./helpers')

const startingGridHeight = 8
let firstGrid = helpers.initializeGrid(startingGridHeight, 4)
let secondGrid = helpers.initializeGrid(startingGridHeight, 4)

const fillColumn = (grid, height, column) => {
  for (let x = 3; x < height; x++) {
    grid[[x,column]] = 'red'
  }
}

for (let y = 0; y < 3; y++) {
  fillColumn(firstGrid, startingGridHeight, y)
  fillColumn(secondGrid, startingGridHeight, y)
}

fillColumn(secondGrid, startingGridHeight, 3)

module.exports.threeColumnsFilledGrid = firstGrid;
module.exports.allColumnsFilledGrid = secondGrid;