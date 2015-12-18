import * as Immutable from 'immutable'
import { generatePuzzle, IGrid, getErrors, IError, getFilledCellsCount } from '../../tools/sudoku'

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
  solved: boolean,
  seed?: string
  difficulty?: string
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
    errors: [],
    solved: false
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
      return state
        .setIn(['cells', scvAction.pos.y, scvAction.pos.x, 'value'], scvAction.value)
        .update(s => {
          let grid = mapGridViewToGrid(s.get('cells').toJS())
          const errors = getErrors(grid)
          return s
            .set('errors', Immutable.fromJS(errors))
            .set('solved', getFilledCellsCount(grid) === 81 && errors.length === 0)
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
        .set('seed', b.seed)
        .set('difficulty', b.difficulty)
        .set('solved', false)

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