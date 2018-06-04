const helpers = require('./helpers')
const {threeColumnsFilledGrid, allColumnsFilledGrid} = require('./sampleGrids')

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