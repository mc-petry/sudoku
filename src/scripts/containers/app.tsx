import * as React from 'react'
import { connect } from 'react-redux'
import GamePage from './game/page'
import NewGamePage from './new-game/page'
import CardSlide from '../components/card-slide'
import { IStore } from '../redux/store'
import { INavigationStore, Page } from '../redux/modules/navigation'

interface IAppProps {
  navigation?: INavigationStore
  dispatch?: Redux.Dispatch
}

@connect((state: IStore) => {
  return {
    navigation: state.navigation.toJS()
  }
})
export default class App extends React.Component<IAppProps, any> {  
  render() {
    const { selectedPage } = this.props.navigation
    return (
      <div className="container">
        <CardSlide isVisible={selectedPage === Page.Game}>
          <GamePage />
        </CardSlide>
        <CardSlide isVisible={selectedPage === Page.Newgame}>
          <NewGamePage />
        </CardSlide>
      </div>
    )
  }
}