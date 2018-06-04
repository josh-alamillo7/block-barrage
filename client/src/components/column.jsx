import React from 'react';

const Column = ( {grid, row, allColumns} ) => {

  return allColumns.map((column) => {
    return <span id={`${row},${column}`} className='square' style={{'background-color': grid[[row, column]]}}></span>
  })
}

module.exports = Column