import * as React from 'react'
import { connect } from 'react-redux'
import Cell from './cell'
import { Error } from '../../tools/sudoku'
import { IBoardStore, ICell } from '../../redux/modules/board'
import * as classnames from 'classnames'

interface IBoardContainerProps {
  board?: IBoardStore
}

interface IBoardContainerState {
  ctrlKey?: boolean
}

@connect(state => {
  return {
    board: state.board.toJS()
  }
})
export default class BoardContainer extends React.Component<IBoardContainerProps, IBoardContainerState> {
  state: IBoardContainerState = {
    ctrlKey: false
  }

  private onDocumentKeyDown = (e: KeyboardEvent) => {
    if (e.which === 17) {
      if (!this.state.ctrlKey)
        this.setState({ ctrlKey: true })
    }
  }

  private onDocumentKeyUp = (e: KeyboardEvent) => {
    if (e.which === 17) {
      this.setState({ ctrlKey: false })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onDocumentKeyDown, false)
    document.removeEventListener('keyup', this.onDocumentKeyUp, false)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onDocumentKeyDown, false)
    document.addEventListener('keyup', this.onDocumentKeyUp, false)
  }

  render() {
    const { board } = this.props
    const { ctrlKey } = this.state

    return (
      <div className={classnames('board', { '-ctrl': ctrlKey })}>
        {board.cells.map((j, nj) => j.map((i, ni) => <Cell data={i} x={ni} y={nj} errorClasses={this.getErrorClasses(ni, nj, i) } />))}
      </div>
    )
  }

  private getErrorClasses(x: number, y: number, cell: ICell): string[] {
    let errors = []
    this.props.board.errors.forEach(e => {
      switch (e.type) {
        case Error.Row:
          if (e.position.y === y)
            errors.push('cell--err-row')
          break

        case Error.Column:
          if (e.position.x === x)
            errors.push('cell--err-column')
          break
      }

      if (e.position.x === x && e.position.y === y && !cell.locked)
        errors.push('cell--err-self')
    })

    return errors
  }
}