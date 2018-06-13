import React from 'react';
import reactDOM from 'react-dom';
import {initializeGrid, genNewBlock, dropBlock, scoreGrid} from '../../lib/helpers.js';
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
      droppedBlocks: [],
      scoreInfo: {
        crushDisplays: [],
        multiplier: 1,
        totalScore: 0,
      },
      action: 'create'
    }
  }

  componentDidMount() {
    setInterval(this.handleAction.bind(this), 500)
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
          action: postDropInfo.action,
          droppedBlocks: postDropInfo.droppedBlocks
        })
        break
      case 'score':
        let postScoreInfo = scoreGrid(app.state.grid, app.state.scoreInfo.multiplier, app.state.droppedBlocks, app.state.scoreInfo.totalScore, app.height)
        app.setState({
          grid: postScoreInfo.grid,
          scoreInfo: postScoreInfo.scoreInfo,
          action: postScoreInfo.action,
          droppedBlocks: postScoreInfo.droppedBlocks
        })
        break
      case 'gameOver':
        null
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