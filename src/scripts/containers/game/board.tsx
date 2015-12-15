import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Cell from './cell'
import { Error } from '../../tools/sudoku'
import { IBoardStore, ICell } from '../../redux/modules/board'

interface IBoardContainerProps {
  board?: IBoardStore
}

@connect(state => {
  return {
    board: state.board.toJS()
  }
})
export default class BoardContainer extends React.Component<IBoardContainerProps, any> {
  private getErrorClasses(x: number, y: number, cell: ICell): string[] {
    let errors = []
    this.props.board.errors.forEach(e => {
      switch (e.type) {
        case Error.Row:
          if (e.position.y == y)
            errors.push('cell--err-row')
          break
        
        case Error.Column:
          if (e.position.x == x)
            errors.push('cell--err-column')
        
        case Error.Block:
          // TODO ?
          break;
      }
      
      if (e.position.x == x && e.position.y == y && !cell.locked)
        errors.push('cell--err-self')
    })
    
    return errors
  }

  render() {
    const { board } = this.props

    return (
      <div className="board">
        {board.cells.map((j, nj) => j.map((i, ni) => <Cell data={i} x={ni} y={nj} errorClasses={this.getErrorClasses(ni, nj, i) } />))}
      </div>
    )
  }
}