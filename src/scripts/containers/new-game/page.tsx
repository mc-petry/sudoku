import * as React from 'react'
import { connect } from 'react-redux'
import Header from '../header'
import Footer from '../footer'
import GameOptions from './game-options'
import { startNewGame } from '../../redux/modules/board'
import { selectPage, Page } from '../../redux/modules/navigation'

interface INewGamePageRefs extends React.ComponentRefs {
  options: GameOptions
}

@connect(state => new Object())
export default class NewGamePage extends React.Component<any, any> {
  refs: INewGamePageRefs

  render() {
    return (
      <div className='page'>
        <Header>
          <button className='btn btn--back header__back' onClick={e => this.onBackClicked()}>Back</button>
          <div className='header__title'>New game</div>
        </Header>
        <GameOptions ref='options' />
        <Footer>
          <button className='btn footer__btn' onClick={e => this.onStartClicked()}>Start!</button>
        </Footer>
      </div>
    )
  }

  private onBackClicked() {
    this.props.dispatch(selectPage(Page.Game))
  }

  private onStartClicked() {
    const { level, seed } = this.refs.options.state
    const { dispatch } = this.props

    // TODO: use redux-thunk
    dispatch(startNewGame(seed, level))
    dispatch(selectPage(Page.Game))
  }
}