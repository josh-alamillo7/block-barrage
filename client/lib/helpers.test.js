const helpers = require('./helpers')

test('TEST: returnMe returns the value put in', () => {
  expect(helpers.return('me')).toBe('me')
});

test('initializeGrid should return an object with the correct number of keys', () => {
  expect(helpers.initializeGrid(3, 4)[[2, 3]]).toBe('grey')
  expect(Object.keys(helpers.initializeGrid(5, 8)).length).toBe(40)
})