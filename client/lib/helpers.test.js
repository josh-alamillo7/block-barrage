const helpers = require('./helpers')

test('returns the value put in', () => {
  expect(helpers.return('me')).toBe('me')
});