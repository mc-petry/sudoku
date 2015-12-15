import * as Immutable from 'immutable'
import { generatePuzzle, IGrid } from '../../tools/sudoku'

const SELECT_PAGE = 'navigation/SELECT_PAGE'

export const enum Page {
  Game,
  Newgame  
}

export interface INavigationStore {
  selectedPage: Page
}

function initialState() {
  let store: INavigationStore = {
    selectedPage: Page.Newgame
  }

  return Immutable.fromJS(store)
}

export default function reducer(state: Immutable.Map<string, any> = initialState(), action: Redux.IAction) {
  switch (action.type) {
    case SELECT_PAGE:
      const selectPageAction = action as ISelectPageAction
      return state.update('selectedPage', x => selectPageAction.page)
      
    default:
      return state
  }
}

interface ISelectPageAction extends Redux.IAction {
  page: Page
}

export function selectPage(page: Page) {
  return {
    type: SELECT_PAGE,
    page
  }
}