import React from 'react'

const CrusherInfo = ({ action, nextCrusher, score }) => {
  if (action === 'crush') {
    return (
      <h2 className='crusherInfo'>Now crushing</h2>)
  } else if (action !== 'gameOver') {
    if (nextCrusher - score <= 0) {
      return (<h2 className='crusherInfo'>You earned a crusher! Crusher coming next...</h2>)
    } else {
      if (nextCrusher - score === 1) {
        return (<h2 className='crusherInfo'>1 point to next Crusher</h2>)
      }
      return (<h2 className='crusherInfo'>{nextCrusher - score} points to next Crusher</h2>)
    }
  } else {
    return (<h2 className='crusherInfo'>Game over! Final score: {score}</h2>)
  }
}

export default CrusherInfo