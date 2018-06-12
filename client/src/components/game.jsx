import React from 'react';
import reactDOM from 'react-dom';
import {initializeGrid, genNewBlock, dropBlock} from '../../lib/helpers.js';
import Grid from './grid.jsx'

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.height = 20;
    this.width = 4;
    this.state = {
      currentBlock: {
        colorOne: null,
        colorTwo: null,
        column: null,
        secBlockPosition: null,
      },
      grid: initializeGrid(this.height, this.width),
      scoreInfo: {
        crushDisplays: {},
        multiplier: 1,
        totalScore: 0,
        positionsToCheck: []
      },
      action: 'create'
    }
  }

  componentDidMount() {
    setInterval(this.handleAction.bind(this), 200)
  }

  handleAction() {
    const app = this;
    switch(app.state.action) {
      case 'create':
        let newInfo = genNewBlock(app.state.grid, app.width)
        app.setState({
          currentBlock: newInfo.newBlock,
          grid: newInfo.grid,
          action: newInfo.action
        })
        break
      case 'drop':
        let postDropInfo = dropBlock(app.state.grid, app.state.currentBlock)
        app.setState({
          grid: postDropInfo.grid,
          currentBlock: postDropInfo.currentBlock,
          action: postDropInfo.action
        })
        break
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