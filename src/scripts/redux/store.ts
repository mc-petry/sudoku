import { createStore, compose, combineReducers } from 'redux'
import board from './modules/board'
import navigation from './modules/navigation'

export interface IStore {
  board: Immutable.Map<any, any>;
  navigation: Immutable.Map<any, any>;
}

const reducer = combineReducers({
  board,
  navigation
})

const store = compose()(createStore)(reducer)

export default store