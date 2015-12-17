import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import Header from '../header'
import Footer from '../footer'
import Board from './board'
import { selectPage, Page } from '../../redux/modules/navigation'
import { IBoardStore } from '../../redux/modules/board'

interface IGamePageProps extends React.Props<any> {
  dispatch?: Dispatch
  board?: IBoardStore
}

@connect(({board}) => ({ board: board.toJS() }))
export default class GamePage extends React.Component<IGamePageProps, any> {
  render() {
    const { seed, difficulty } = this.props.board

    return (
      <div className='page'>
        <Header>
          <div className='header__title'>
            <div className='header__sub-title'>Seed:</div> {seed}
            <div className='header__sub-title header__sub-title--last'>Difficulty:</div> {difficulty}
          </div>
        </Header>
        <Board />
        <Footer>
           <button className='btn footer__btn' onClick={e => this.onStartNewGameClicked()}>New game</button>
        </Footer>
      </div>
    )
  }

  private onStartNewGameClicked() {
    this.props.dispatch(selectPage(Page.Newgame))
  }
}