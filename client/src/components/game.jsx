import React from 'react';
import reactDOM from 'react-dom';
import {initializeGrid, genNewBlock, dropBlock, scoreGrid, swapBlockPositions, moveBlockHoriz, crushColumn} from '../../lib/helpers.js';
import Grid from './grid.jsx'
import ScoreInfo from './scoreinfo.jsx'

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.height = 20;
    this.width = 4;
    this.interval = 'short';
    this.intervalIdentifier = null;
    this.state = {
      action: 'create',
      currentBlock: {
        colorOne: null,
        colorTwo: null,
        column: null,
        secBlockPosition: null,
      },
      crusher: {
        currRow: null,
        column: null,
        firstUncrushedRow: null
      },
      grid: initializeGrid(this.height, this.width),
      nextCrusher: 50,
      swap: false,
      droppedBlocks: [],
      scoreInfo: {
        crushDisplays: [],
        multiplier: 1,
        totalScore: 0,
      }
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount() {
    this.intervalIdentifier = setInterval(this.handleAction.bind(this), 150)
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
    if (app.state.action === 'crush') {
      clearInterval(app.intervalIdentifier);
      app.intervalIdentifier = setInterval(app.handleAction.bind(app), 2000)
    } else if (app.state.action === 'score' && app.interval === 'short') {
      clearInterval(app.intervalIdentifier);
      app.intervalIdentifier = setInterval(app.handleAction.bind(app), 200);
      app.interval = 'long'
    } else if (app.state.action !== 'score' && app.interval === 'long') {
      clearInterval(app.intervalIdentifier);
      app.intervalIdentifier = setInterval(app.handleAction.bind(app), 150);
      app.interval = 'short'
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
      case 'crush':
        let postCrushInfo = crushColumn(app.state.grid, app.state.crusher, app.state.droppedBlocks)
        app.setState({
          grid: postCrushInfo.grid,
          action: postCrushInfo.action,
          crusher: postCrushInfo.crusher,
          droppedBlocks: postCrushInfo.droppedBlocks
        })
        break
      case 'drop':
        let postDropInfo = dropBlock(app.state.grid, app.state.currentBlock)
        app.setState({
          grid: postDropInfo.grid,
          currentBlock: postDropInfo.currentBlock,
          action: postDropInfo.action,
          droppedBlocks: postDropInfo.droppedBlocks,
        })
        break
      case 'score':
        let postScoreInfo = scoreGrid(app.state.grid, app.state.scoreInfo.multiplier, app.state.droppedBlocks, 
          app.state.scoreInfo.totalScore, app.height, app.width, app.state.nextCrusher)
        app.setState({
          grid: postScoreInfo.grid,
          nextCrusher: postScoreInfo.nextCrusherScore,
          scoreInfo: postScoreInfo.scoreInfo,
          action: postScoreInfo.action,
          droppedBlocks: postScoreInfo.droppedBlocks,
          crusher: postScoreInfo.crusher
        })
        break
      case 'gameOver':
        clearInterval(app.intervalIdentifier)
        break
    }  
    
  }

  handleKeyPress(e) {
    const app = this;
    if (e.keyCode === 32 && app.state.action === 'drop') {
      app.setState({
        swap: true
      })
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
        </div>
        <div className = "gridAndScoreContainer">
          <div className = "gridContainer">
            <Grid grid={this.state.grid} height={this.height} width={this.width} />
          </div>
          <ScoreInfo totalScore={this.state.scoreInfo.totalScore} crushDisplays={this.state.scoreInfo.crushDisplays} multiplier={this.state.scoreInfo.multiplier}/>
        </div>
      </div>
      );
  }

}

export default Game