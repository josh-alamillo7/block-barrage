const helpers = require('./helpers')
const {threeColumnsFilledGrid, allColumnsFilledGrid, firstColumnAlmostHalfFilledGrid, 
  nonMatchingBottomTwoRowsGrid} = require('./sampleGrids')
const {topLeftBlock, middleLeftBlock, bottomRightBlock, nonMatchingTopLeftBlock, matchingTopLeftBlock,
horizMatchSecondColBlock} = require('./sampleBlocks')



test('TEST: returnMe returns the value put in', () => {
  expect(helpers.return('me')).toBe('me')
});

test('initializeGrid should return an object with the correct number of keys', () => {
  expect(helpers.initializeGrid(3, 4)[[2, 3]]).toBe('silver')
  expect(Object.keys(helpers.initializeGrid(5, 8)).length).toBe(40)
})

test('genNewBlock should return a new grid with the two-colored block on a random available column', () => {
  const testGridOne = helpers.initializeGrid(8, 4);
  let resultGrid = helpers.genNewBlock(testGridOne, 4).grid
  let colors = []
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      colors.push(resultGrid[[y,x]])
    }
  }
  let nonGrays = colors.filter((color) => {
    return color !== 'silver'
  })
  expect(nonGrays.length).toBe(4)
})

test('genNewBlock should only choose an available column if there are unavailable columns', () => {
  let oneFreeColumnInfo = helpers.genNewBlock(threeColumnsFilledGrid, 4)
  let resultBlock = oneFreeColumnInfo.newBlock
  let resultAction = oneFreeColumnInfo.action

  expect(resultBlock.column).toBe(3);
  expect(resultAction).toBe('drop');
})

test('genNewBlock should return the same grid, no block, and a game over state if there are no free columns', () => {
  let noFreeColumnInfo = helpers.genNewBlock(allColumnsFilledGrid, 4)
  let resultBlock = noFreeColumnInfo.newBlock
  let resultAction = noFreeColumnInfo.action

  expect(resultBlock).toBe(null);
  expect(resultAction).toBe('gameOver')
})

test('dropBlock should return the same grid, no block, and a "score" action in the state if the block has a block below it', () => {
  let testGrid = Object.assign({}, firstColumnAlmostHalfFilledGrid)
  helpers.placeBlockAtPosition(testGrid, middleLeftBlock)

  let dropResult = helpers.dropBlock(testGrid, middleLeftBlock)

  expect(dropResult.grid).toEqual(testGrid)
  expect(dropResult.currentBlock.column).toEqual(null)
  expect(dropResult.action).toEqual('score')
})

test('dropBlock should return the same grid, no block, and a "score" action in the state if the block hits the bottom of the grid', () => {
  let testGrid = Object.assign({}, firstColumnAlmostHalfFilledGrid);
  helpers.placeBlockAtPosition(testGrid, bottomRightBlock);

  let dropResult = helpers.dropBlock(testGrid, bottomRightBlock);

  expect(dropResult.grid).toEqual(testGrid);
  expect(dropResult.currentBlock.column).toEqual(null);
  expect(dropResult.action).toEqual('score');
})

test('dropBlock should return a grid with the block dropped and a "drop" action in the state if the block has no block below it', () => {
  let testGrid = Object.assign({}, firstColumnAlmostHalfFilledGrid);
  let copyOfTopLeftBlock = Object.assign({}, topLeftBlock)
  helpers.placeBlockAtPosition(testGrid, copyOfTopLeftBlock);

  let dropResult = helpers.dropBlock(testGrid, copyOfTopLeftBlock);

  expect(dropResult.grid[[0,0]]).toBe('silver');
  expect(dropResult.grid[[2,0]]).toBe('red');
  expect(dropResult.grid[[4,0]]).toBe('yellow');
  expect(dropResult.currentBlock.secBlockPosition).toBe(3);
  expect(dropResult.action).toBe('drop');
})

test('scoreGrid should return the same score and a "create" action if there are no scoring positions', () => {
  let testGrid = Object.assign({}, nonMatchingBottomTwoRowsGrid)
  helpers.placeBlockAtPosition(testGrid, nonMatchingTopLeftBlock);

  let nonMatchResult = helpers.scoreGrid(testGrid, 1, [{color: 'blue', column: 0, firstPos: 0, lastPos: 1},
    {color: 'green', column: 0, firstPos: 2, lastPos: 3}], 4, 8)

  expect(nonMatchResult.scoreInfo.totalScore).toBe(4);
  expect(nonMatchResult.droppedBlocks.length).toBe(0);
  expect(nonMatchResult.action).toBe('create');
})

test('scoreGrid should return the appropriate information for a vertical match', () => {
  let testGrid = Object.assign({}, nonMatchingBottomTwoRowsGrid)
  helpers.placeBlockAtPosition(testGrid, matchingTopLeftBlock);

  let matchResult = helpers.scoreGrid(testGrid, 1, [{color: 'green', column: 0, firstPos: 0, lastPos: 1},
    {color: 'blue', column: 0, firstPos: 2, lastPos: 3}], 4, 8)

  expect(matchResult.scoreInfo.multiplier).toBe(2);
  expect(matchResult.scoreInfo.totalScore).toBe(5);
  expect(matchResult.scoreInfo.crushDisplays[0]).toEqual({
    color: 'blue',
    score: 1
  });
  expect(matchResult.droppedBlocks[0]).toEqual({
    color: 'green',
    column: 0,
    firstPos: 4,
    lastPos: 5
  });
  expect(matchResult.action).toBe('score')
}) 

test('scoreGrid should return the appropriate information for a horizontal match', () => {
  let testGrid = Object.assign({}, nonMatchingBottomTwoRowsGrid);
  helpers.placeBlockAtPosition(testGrid, topLeftBlock);
  helpers.placeBlockAtPosition(testGrid, horizMatchSecondColBlock);

  let horizMatchResult = helpers.scoreGrid(testGrid, 1, [{color: 'orange', column: 1, firstPos: 0, lastPos: 1},
    {color: 'yellow', column: 1, firstPos: 2, lastPos: 3}], 4, 8)

  expect(horizMatchResult.scoreInfo.multiplier).toBe(2);
  expect(horizMatchResult.scoreInfo.totalScore).toBe(5);
  expect(horizMatchResult.scoreInfo.crushDisplays[0]).toEqual({
    color: 'yellow',
    score: 1
  });
  expect(horizMatchResult.droppedBlocks[0]).toEqual({
    color: 'red',
    column: 0,
    firstPos: 2,
    lastPos: 3
  });
  expect(horizMatchResult.droppedBlocks[1]).toEqual({
    color: 'orange',
    column: 1,
    firstPos: 2,
    lastPos: 3
  })
})

test('crushLowestBlock should return a grid with the lowest block smashed', () => {
  let testGrid = helpers.initializeGrid(8, 4);
  helpers.placeBlockAtPosition(testGrid, bottomRightBlock);

  helpers.crushLowestBlock(testGrid, 7, 3, 3);

  helpers.prettyGridPrint(testGrid, 8, 4);
  expect(testGrid[[7,3]]).toBe('yellow');
  expect(testGrid[[6,3]]).toBe('red');
  expect(testGrid[[5,3]]).toBe('red');
  expect(testGrid[[4,3]]).toBe('silver');

})