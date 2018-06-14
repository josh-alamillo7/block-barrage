import React from 'react';

const Column = ( {grid, row, allColumns} ) => {

  return allColumns.map((column) => {

    return <span id={`${row},${column}`} className='square' style={{'backgroundColor': grid[[row, column]]}}></span>
  })
}

module.exports = Column