const topLeftBlock = {
  colorOne: 'red',
  colorTwo: 'yellow',
  column: 0,
  secBlockPosition: 2
}

const middleLeftBlock = {
  colorOne: 'red',
  colorTwo: 'yellow',
  column: 0,
  secBlockPosition: 3
}

const bottomRightBlock = {
  colorOne: 'red',
  colorTwo: 'yellow',
  column: 3,
  secBlockPosition: 6
}

const middleRightBlockAboveCrushedBlock = {
  colorOne: 'red',
  colorTwo: 'yellow',
  column: 3,
  secBlockPosition: 4
}

const nonMatchingTopLeftBlock = {
  colorOne: 'blue',
  colorTwo: 'green',
  column: 0,
  secBlockPosition: 2
}

const matchingTopLeftBlock = {
  colorOne: 'green',
  colorTwo: 'blue',
  column: 0,
  secBlockPosition: 2
}

const horizMatchSecondColBlock = {
  colorOne: 'orange',
  colorTwo: 'yellow',
  column: 1,
  secBlockPosition: 2
}

module.exports.topLeftBlock = topLeftBlock;
module.exports.middleLeftBlock = middleLeftBlock;
module.exports.bottomRightBlock = bottomRightBlock;
module.exports.nonMatchingTopLeftBlock = nonMatchingTopLeftBlock;
module.exports.matchingTopLeftBlock = matchingTopLeftBlock;
module.exports.horizMatchSecondColBlock = horizMatchSecondColBlock;
module.exports.middleRightBlockAboveCrushedBlock = middleRightBlockAboveCrushedBlock;