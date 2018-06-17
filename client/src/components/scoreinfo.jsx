import React from 'react';

const ScoreInfo = ( {totalScore, crushDisplays, multiplier} ) => {

  const scoreDisplay = [<div className="totalScore">Score: {totalScore}</div>]

  const scoreAdds = crushDisplays.map((display) => {
    return <div style={{'color': display.color, 'font-size': (10 * multiplier + 20) + 'px'}} className="scoreAdd"> + {display.score * (multiplier - 1)}</div>
  })

  return <div className="scoreInfoContainer">{scoreDisplay.concat(scoreAdds)}</div>

}

module.exports = ScoreInfo