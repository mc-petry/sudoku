import * as Immutable from 'immutable'
import { generatePuzzle, IGrid, getErrors, IError } from '../../tools/sudoku'

const SET_CELL_VALUE = 'board/SET_CELL_VALUE'
const SET_CELL_MARK = 'board/SET_CELL_MARK'
const START_NEW_GAME = 'board/START_NEW_GAME'

export interface IPoint {
  x: number
  y: number
}

export interface ICell {
  /**
   * Current value
   */
  value?: number

  /**
   * Manual markers
   */
  marks: number[]

  locked?: boolean
}

type IGridView = ICell[][];

export interface IBoardStore {
  cells: IGridView
  src: IGrid
  puzzle: IGrid
  errors: IError[]
}

function mapGridToGridView(grid: IGrid): IGridView {
  let gv: IGridView = []

  for (let j = 0; j < 9; j++) {
    gv[j] = [];
    for (let i = 0; i < 9; i++) {
      let value = grid.data[j][i]
      gv[j][i] = {
        marks: [],
        locked: value ? true : false,
        value
      }
    }
  }

  return gv
}

function mapGridViewToGrid(gv: IGridView): IGrid {
  let grid: IGrid = {
    data: []
  }

  for (let j = 0; j < 9; j++) {
    grid.data[j] = [];
    for (let i = 0; i < 9; i++) {
      grid.data[j][i] = gv[j][i].value
    }
  }

  return grid
}

function initialState() {
  const puzzle = generatePuzzle(Math.random().toString(), 30)

  let store: IBoardStore = {
    cells: [],
    src: puzzle.src,
    puzzle: puzzle.src,
    errors: []
  }

  for (let j = 0; j < 9; j++) {
    store.cells[j] = [];
    for (let i = 0; i < 9; i++) {
      store.cells[j][i] = {
        marks: []
      }
    }
  }

  return Immutable.fromJS(store)
}

export default function reducer(state: Immutable.Map<string, any> = initialState(), action: Redux.IAction, xt: any) {
  switch (action.type) {
    case SET_CELL_VALUE:
      const scvAction = action as ISetCellValueAction
      // if (getFilledCellsCount(grid) == 81 && errors.length == 0)
      // TODO: dispatch CHECK_PUZZLE event here

      return state
        .setIn(['cells', scvAction.pos.y, scvAction.pos.x, 'value'], scvAction.value)
        .update(s => {
          const errors = getErrors(mapGridViewToGrid(s.get('cells').toJS()))
          return s.set('errors', Immutable.fromJS(errors))
        })

    case SET_CELL_MARK:
      const mark = action as ISetCellMarkValueAction
      return state
        .updateIn(['cells', mark.pos.y, mark.pos.x, 'marks'], (marks: Immutable.List<number>) => {
          if (marks.contains(mark.value))
            return marks.filter(x => x !== mark.value)

          return marks.push(mark.value)
        })

    case START_NEW_GAME:
      const b = action as IStartNewGameAction
      let filledCells

      switch (b.difficulty) {
        case 'easy':
          filledCells = 40
          break

        case 'normal':
          filledCells = 33
          break

        case 'hard':
          filledCells = 27
          break

        case 'evil':
          filledCells = 22
          break

        default:
          throw new Error('Invalid difficulty')
      }

      const puzzle = generatePuzzle(b.seed, filledCells)
      return state
        .set('cells', Immutable.fromJS(mapGridToGridView(puzzle.puzzle)))
        .set('src', puzzle.src)
        .set('puzzle', puzzle.puzzle)
        .set('errors', [])

    default:
      return state
  }
}

interface ISetCellValueAction extends Redux.IAction {
  pos: IPoint
  value?: number
}

export function setCellValue(pos: IPoint, value: number): ISetCellValueAction {
  return {
    type: SET_CELL_VALUE,
    pos,
    value
  }
}

interface ISetCellMarkValueAction extends Redux.IAction {
  pos: IPoint
  value?: number
}

export function setCellMark(pos: IPoint, value: number): ISetCellMarkValueAction {
  return {
    type: SET_CELL_MARK,
    pos,
    value
  }
}

interface IStartNewGameAction extends Redux.IAction {
  seed: string
  difficulty: string
}

export function startNewGame(seed: string, difficulty: string): IStartNewGameAction {
  return {
    type: START_NEW_GAME,
    seed,
    difficulty
  }
}