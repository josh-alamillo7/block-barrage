import React from 'react';

const ScoreInfo = ( {totalScore, crushDisplays, multiplier} ) => {

  const scoreDisplay = [<span className="totalScore">Score: {totalScore}</span>]

  const scoreAdds = crushDisplays.map((display) => {
    return <span style={{'color': display.color}} className="scoreAdd"> + {display.score * (multiplier - 1)}</span>
  })

  return <div>{scoreDisplay.concat(scoreAdds)}</div>

}

module.exports = ScoreInfo