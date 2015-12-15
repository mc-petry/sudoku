import * as random from 'seedrandom'
import { getRandom, shuffle } from './helpers'

interface IPosition {
  x: number
  y: number
}

export interface IGrid {
  data: number[][]
}

interface IGridMap {
  data: number[][][]
}

interface ISkip {
  p: IPosition
  value: number
}

interface ISolveOptions {  
  /**
   * Specify to use random function
   */
  rnd?: () => number
  
  /**
   * Specify to skip some value variant in specific position
   */
  skip?: ISkip
}

export const enum Error {
  Block,
  Row,
  Column
}

export interface IError {
  type: Error
  position: { x: number, y: number }
}

export function createEmptyGrid(): number[][] {
  let grid = []

  for (let j = 0; j < 9; j++) {
    grid[j] = []

    for (let i = 0; i < 9; i++)
      grid[j][i] = null
  }

  return grid
}

function getNextEmptyCell(grid: IGrid): IPosition {
  for (let j = 0; j < 9; j++) {
    for (let i = 0; i < 9; i++) {
      if (!grid.data[j][i])
        return { x: i, y: j }
    }
  }

  return null
}

export function clone(grid: IGrid): IGrid {
  return { data: grid.data.map(row => row.slice()) }
}

export function print(grid: IGrid) {
  if (console.group)
    console.group("Sudoku")

  for (let i = 0; i < 9; i++)
    console.log(grid.data[i].map(x => x ? x : '.').join(' '))

  if (console.group)
    console.groupEnd()
}

/**
 * @param p Any cell inside box
 */
function getAllowedValuesAtBox(grid: IGrid, p: IPosition): number[] {
  let values: boolean[] = Array(10)

  const xOffset = Math.floor(p.x / 3) * 3
  const yOffset = Math.floor(p.y / 3) * 3

  for (let i = 1; i < 10; i++)
    values[i] = true

  for (let i = 0; i < 9; i++) {
    if (grid.data[p.y][i])
      values[grid.data[p.y][i]] = false

    if (grid.data[i][p.x])
      values[grid.data[i][p.x]] = false
  }

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      const x = xOffset + i
      const y = yOffset + j

      if (grid.data[y][x])
        values[grid.data[y][x]] = false
    }
  }

  let res = []
  for (let i = 1; i < values.length + 1; i++)
    if (values[i])
      res.push(i)

  return res
}

/**
 * Implementation of back track algorithm
 * with optimizations under the terms of sudoku
 * 
 * @param p Current cell position
 */
function backTrack(grid: IGrid, p: IPosition, options: ISolveOptions = {}) {
  if (!p)
    return true

  let values = getAllowedValuesAtBox(grid, p)

  if (options.rnd)
    values = shuffle(options.rnd, values)

  for (let v of values) {
    if (options.skip)
      if (p.x == options.skip.p.x && p.y == options.skip.p.y && options.skip.value == v)
        continue

    grid.data[p.y][p.x] = v
    let nextp = getNextEmptyCell(grid)

    if (backTrack(grid, nextp, options))
      return true
  }

  grid.data[p.y][p.x] = null
  return false
}

/**
 * Constraint Propagation
 */
function eliminate(grid: IGrid, skip?: ISkip): IGridMap {  
  // Create initial map
  let map: IGridMap = { data: [] }
  for (let j = 0; j < 9; j++) {
    map.data[j] = []

    for (let i = 0; i < 9; i++) {
      if (grid.data[j][i])
        map.data[j][i] = [grid.data[j][i]]
      else
        map.data[j][i] = getAllowedValuesAtBox(grid, { x: i, y: j })
    }
  }

  for (let j = 0; j < 9; j++)
    for (let i = 0; i < 9; i++)
      if (map.data[j][i].length == 1)
        simplify(grid, map, { x: i, y: j }, skip)

  return map
}

/**
 * Removes impossible values in row, column, box 
 * for value in specified position 
 */
function simplify(grid: IGrid, map: IGridMap, p: IPosition, skip: ISkip) {
  if (grid.data[p.y][p.x])
    return;

  if (skip && skip.p.x == p.x && skip.p.y == p.y && map.data[p.y][p.x][0] == skip.value)
    return;

  const v = grid.data[p.y][p.x] = map.data[p.y][p.x][0]

  for (let i = 0; i < 9; i++) {
    // Simplify in row
    if (i != p.x && map.data[p.y][i].length != 1) {
      let values = map.data[p.y][i] = map.data[p.y][i].filter(x => x != v)
      if (values.length == 1)
        simplify(grid, map, { x: i, y: p.y }, skip)
    }
    
    // Simplify in column
    if (i != p.y && map.data[i][p.x].length != 1) {
      let values = map.data[i][p.x] = map.data[i][p.x].filter(x => x != v)
      if (values.length == 1)
        simplify(grid, map, { x: p.x, y: i }, skip)
    }
  }

  // Simplify in box
  const xoffset = Math.floor(p.x / 3) * 3
  const yoffset = Math.floor(p.y / 3) * 3

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      const x = xoffset + i
      const y = yoffset + j

      if (x != p.x && y != p.y && map.data[y][x].length != 1) {
        let values = map.data[y][x] = map.data[y][x].filter(x => x != v)
        if (values.length == 1)
          simplify(grid, map, { x, y }, skip)
      }
    }
  }
}

/**
 * Solve sudoku using combination of 2 algorithms:
 *  - Constraint Propagation
 *  - Back Track
 */
export function solve(grid: IGrid, options: ISolveOptions = {}): boolean {
  eliminate(grid, options && options.skip ? options.skip : null)
  return backTrack(grid, getNextEmptyCell(grid), options)
}

export function getFilledCellsCount(grid: IGrid): number {
  let n = 0

  for (let j = 0; j < 9; j++)
    for (let i = 0; i < 9; i++)
      if (grid.data[j][i])
        n++

  return n
}

function deleteCells(grid: IGrid, filledCells: number, rnd: () => number): boolean {
  let cells = Array<number>(81)
  for (let i = 0; i < cells.length; i++)
    cells[i] = i

  while (getFilledCellsCount(grid) != filledCells) {
    if (cells.length == 0)
      return false

    let nci = getRandom(rnd, 0, cells.length)
    let ncv = cells[nci]

    let y = Math.floor(ncv / 9)
    let x = ncv % 9

    let cellValue = grid.data[y][x]

    grid.data[y][x] = null

    let resolved = solve(clone(grid), {
      skip: {
        p: { x, y },
        value: cellValue
      }
    })

    if (resolved)
      grid.data[y][x] = cellValue

    cells.splice(nci, 1)
  }

  return true
}

/**
 * Performance critical! Don't use less than 21 filled cells
 */
export function generatePuzzle(seed: string, filledCells: number): { src: IGrid, puzzle: IGrid } {
  let rnd = random.alea(seed)
  let src: IGrid
  let puzzle: IGrid
  let result: boolean

  do {
    // Generate solved grid
    src = { data: createEmptyGrid() }
    backTrack(src, getNextEmptyCell(src), { rnd })
    
    // Try to delete cells
    puzzle = clone(src)
    result = deleteCells(puzzle, filledCells, rnd)
  }
  while (!result)

  return { puzzle, src }
}

/**
 * Gets all errors
 */
export function getErrors(grid: IGrid): IError[] {
  let errors: IError[] = []

  for (let j = 0; j < 9; j += 3) {
    for (let i = 0; i < 9; i += 3) {

      for (let j1 = 0; j1 < 3; j1++) {
        for (let i1 = 0; i1 < 3; i1++) {
          const y1 = j + j1
          const x1 = i + i1

          for (let j2 = 0; j2 < 3; j2++) {
            for (let i2 = 0; i2 < 3; i2++) {
              const y2 = j + j2
              const x2 = i + i2

              if (y1 == y2 && x1 == x2)
                continue

              if (!grid.data[y1][x1] || !grid.data[y2][x2])
                continue

              if (grid.data[y1][x1] == grid.data[y2][x2])
                errors.push({
                  type: Error.Block,
                  position: { x: x1, y: y1 }
                })
            }
          }
        }
      }
    }
  }

  for (let j = 0; j < 9; j++) {
    for (let i1 = 0; i1 < 9; i1++) {
      for (let i2 = 0; i2 < 9; i2++) {
        if (i1 == i2)
          continue

        if (grid.data[j][i1] && grid.data[j][i2]) {
          if (grid.data[j][i1] == grid.data[j][i2])
            errors.push({
              type: Error.Row,
              position: { x: i1, y: j }
            })
        }

        if (grid.data[i1][j] && grid.data[i2][j]) {
          if (grid.data[i1][j] == grid.data[i2][j])
            errors.push({
              type: Error.Column,
              position: { x: j, y: i1 }
            })
        }
      }
    }
  }

  return errors
}