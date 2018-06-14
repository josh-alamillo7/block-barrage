import React from 'react';
import reactDOM from 'react-dom';
import {initializeGrid, genNewBlock, dropBlock, scoreGrid, swapBlockPositions, moveBlockHoriz} from '../../lib/helpers.js';
import Grid from './grid.jsx'
import ScoreInfo from './scoreinfo.jsx'

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.height = 20;
    this.width = 4;
    this.state = {
      interval: 200,
      currentBlock: {
        colorOne: null,
        colorTwo: null,
        column: null,
        secBlockPosition: null,
      },
      grid: initializeGrid(this.height, this.width),
      swap: false,
      droppedBlocks: [],
      scoreInfo: {
        crushDisplays: [],
        multiplier: 1,
        totalScore: 0,
      },
      action: 'create'
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount() {
    setInterval(this.handleAction.bind(this), this.state.interval)
    document.addEventListener('keydown', this.handleKeyPress, false)
  }

  handleAction() {
    const app = this;
    if (this.state.swap) {
      swapBlockPositions(app.state.grid, app.state.currentBlock);
      app.setState({
        swap: false
      })
    }
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

  handleKeyPress(e) {
    const app = this;
    if (e.keyCode === 32 && app.state.action === 'drop') {
      app.setState({
        swap: true
      })
      // swapBlockPositions(app.state.grid, app.state.currentBlock)
    } else if (e.keyCode === 37 && app.state.action === 'drop') {
      moveBlockHoriz(app.state.grid, app.state.currentBlock, 'left')
    } else if (e.keyCode === 39 && app.state.action === 'drop') {
      moveBlockHoriz(app.state.grid, app.state.currentBlock, 'right')
    }
  }  

  render() {
    return (
      <div>
        <div className = "aboveGridInfoContainer">
        <h1 className = "gameHeader">Block Barrage</h1>
        <ScoreInfo totalScore={this.state.scoreInfo.totalScore} crushDisplays={this.state.scoreInfo.crushDisplays} multiplier={this.state.scoreInfo.multiplier}/>
        </div>
        <div className = "gridContainer">
          <Grid grid={this.state.grid} height={this.height} width={this.width} />
        </div>
      </div>
      );
  }

}

export default Game