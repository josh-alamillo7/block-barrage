import React from 'react';

const Column = ( {grid, row, allColumns} ) => {

  return allColumns.map((column) => {
    return <span id={`${row},${column}`} className='square' background-color={grid[[row, column]]}>{row},{column}</span>
  })
}

module.exports = Column