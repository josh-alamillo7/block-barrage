const helpers = require('./helpers')

test('TEST: returnMe returns the value put in', () => {
  expect(helpers.return('me')).toBe('me')
});

test('initializeGrid should return an object with the correct number of keys', () => {
  expect(helpers.initializeGrid(3, 4)[[2, 3]]).toBe('grey')
  expect(Object.keys(helpers.initializeGrid(5, 8)).length).toBe(40)
})

test('genNewBlock should return a new grid with the two-colored block on a random available column', () => {
  const testGridOne = helpers.initializeGrid(8, 4);
  let resultGrid = helpers.genNewBlock(testGridOne, 4).grid
  let colors = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      colors.push(resultGrid[[i,j]])
    }
  }
  let nonGrays = colors.filter((color) => {
    return color !== 'grey'
  })
  expect(nonGrays.length).toBe(4)
})

test('genNewBlock should only choose an available column if there are unavailable columns', () => {

})

test('genNewBlock should return the same grid, no block, and a game over state if there are no free columns', () => {

})