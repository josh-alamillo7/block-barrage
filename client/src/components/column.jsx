import React from 'react';

const Column = ( {grid, row, allColumns, crusher} ) => {

  return allColumns.map((column) => {

    if (row === crusher.currRow & column === crusher.column) {
      return <span id={`${row},${column}`} className='square' style={{'backgroundColor': grid[[row, column]]}}>👇</span>
    }
    return <span id={`${row},${column}`} className='square' style={{'backgroundColor': grid[[row, column]]}}></span>

  })
}

module.exports = Column;