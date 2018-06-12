const helpers = require('./helpers')

const startingGridHeight = 8
let firstGrid = helpers.initializeGrid(startingGridHeight, 4)
let secondGrid = helpers.initializeGrid(startingGridHeight, 4)
let thirdGrid = helpers.initializeGrid(startingGridHeight, 4)
let fourthGrid = helpers.initializeGrid(startingGridHeight, 4)

const fillColumnWithOneColor = (grid, height, column) => {
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
  fillColumnWithOneColor(firstGrid, startingGridHeight, y)
  fillColumnWithOneColor(secondGrid, startingGridHeight, y)
}

const addNonmatchingColorsOnBottomTwoRows = (grid) => {
  //first index and first index plus one
  const blueCoordinates = [[4,0], [6,1], [4,2], [6,3]]
  const greenCoordinates = [[6,0], [4,1], [6,2], [4,3]]

  blueCoordinates.forEach((coordinates) => {
    grid[[coordinates[0],coordinates[1]]] = 'blue'
    grid[[coordinates[0] + 1,coordinates[1]]] = 'blue'
  })

  greenCoordinates.forEach((coordinates) => {
    grid[[coordinates[0],coordinates[1]]] = 'green'
    grid[[coordinates[0] + 1,coordinates[1]]] = 'green'
  })

}

const makeGridWithNoMatchesTwo = (grid, height) => {
  const blueCoordinates = [[]]
}

fillColumnWithOneColor(secondGrid, startingGridHeight, 3)
fillColumnAlmostHalfway(thirdGrid, startingGridHeight, 0)
addNonmatchingColorsOnBottomTwoRows(fourthGrid)

module.exports.threeColumnsFilledGrid = firstGrid;
module.exports.allColumnsFilledGrid = secondGrid;
module.exports.firstColumnAlmostHalfFilledGrid = thirdGrid;
module.exports.nonMatchingBottomTwoRowsGrid = fourthGrid;