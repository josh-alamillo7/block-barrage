import React from 'react';
import reactDOM from 'react-dom';
import {initializeGrid} from '../../lib/helpers.js';
import Grid from './grid.jsx'

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.height = 20;
    this.width = 4;
    this.state = {
      currentBlock: {
        colorOne: 'green',
        colorTwo: 'red',
        column: 0,
        secBlockPosition: 1
      },
      grid: initializeGrid(this.height, this.width),
      score: 0
    }
  }

  render() {
    return (
      <div>
        <h1 className = "gameHeader">Block Barrage</h1>
        <div className = "gridContainer">
          <Grid grid={this.state.grid} height={this.height} width={this.width} />
        </div>
      </div>
      );
  }

}

export default Game