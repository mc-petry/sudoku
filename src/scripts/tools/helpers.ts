/**
 * Shuffle array
 */
export function shuffle<T>(rnd: () => number, array: T[]): T[] {
  var currentIndex = array.length, temporaryValue, randomIndex

  while (0 !== currentIndex) {
    randomIndex = Math.floor(rnd() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

/**
 * Get random
 */
export function getRandom(rnd: () => number, min: number, max: number) {
  return Math.floor(rnd() * (max - min) + min);
}