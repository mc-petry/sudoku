import * as React from 'react'
import { connect } from 'react-redux'
import Header from '../header'
import Footer from '../footer'
import Board from './board'
import { selectPage, Page } from '../../redux/modules/navigation'

@connect(() => new Object())
export default class GamePage extends React.Component<any, any> {
  render() {
    return (
      <div className='page'>
        <Header>
          <div className='header__title'>Sudoku</div>
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