jest.dontMock('../sudoku')
jest.dontMock('../helpers')
  
import { generatePuzzle, solve, print, clone, createEmptyGrid } from '../sudoku'

describe('Sudoku', () => {
  it('Generate & solver', () => {
    const n = 10
    
    for (let i = 0; i < n; i++) {
      let puzzle = generatePuzzle(Math.random().toString(), 25)
      let target = clone(puzzle.puzzle)
      
      // Puzzle solved
      expect(solve(target)).toBe(true)
      
      // Source grid equals to solved grid      
      expect(puzzle.src).toEqual(target)
    }
  })
})