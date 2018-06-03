import React from 'react';
import Column from './column.jsx';

const Grid = ( {grid, height, width} ) => {
  const allRows = []
  const allColumns = []

  for (let i = 0; i < height; i++) {
    allRows.push(i)
  }

  for (let j = 0; j < width; j++) {
    allColumns.push(j)
  }

  return allRows.map((row) => {
    return (<div><Column grid={grid} row={row} allColumns={allColumns} /></div>)
  })
}

module.exports = Grid