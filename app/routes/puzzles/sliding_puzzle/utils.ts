export const SLIDER_PUZZLE_SIZE = 4;

export function isAdjacentToEmpty(square: Square, puzzle: Square[]) {
  if (square.empty) return false;
  const emptySquare = puzzle.find((p) => p.empty);
  if (!emptySquare) {
    throw Error(
      "Can't find the missing piece in sliding puzzle: " +
        JSON.stringify(puzzle)
    );
  }
  return (
    (square.position.x - 1 === emptySquare.position.x &&
      square.position.y === emptySquare.position.y) ||
    (square.position.x + 1 === emptySquare.position.x &&
      square.position.y === emptySquare.position.y) ||
    (square.position.y - 1 === emptySquare.position.y &&
      square.position.x === emptySquare.position.x) ||
    (square.position.y + 1 === emptySquare.position.y &&
      square.position.x === emptySquare.position.x)
  );
}

export function count(position: { x: number; y: number }) {
  return position.y * SLIDER_PUZZLE_SIZE + position.x;
}

export function moveSquare(puzzle: Square[], square: Square): Square[] {
  const emptySquareIndex = puzzle.findIndex((p) => p.empty);
  if (!emptySquareIndex) {
    throw Error(
      "Can't find the missing piece in sliding puzzle: " +
        JSON.stringify(puzzle)
    );
  }
  const squareIndex = puzzle.findIndex((p) => p.id === square.id);
  const emptySquare = puzzle[emptySquareIndex];
  let newPuzzle = puzzle;

  newPuzzle[squareIndex] = { ...square, position: emptySquare.position };
  newPuzzle[emptySquareIndex] = { ...emptySquare, position: square.position };
  newPuzzle.sort((a, b) => count(a.position) - count(b.position));
  return newPuzzle;
}

export type Square = {
  position: { x: number; y: number };
  correctPosition: { x: number; y: number };
  id: string;
  empty: boolean;
};

function generatePuzzleSimple(): Omit<Square, "id">[] {
  const puzzle = Array.from(
    Array(SLIDER_PUZZLE_SIZE * SLIDER_PUZZLE_SIZE).keys()
  ).map((index) => {
    const position = {
      x: index % SLIDER_PUZZLE_SIZE,
      y: Math.floor(index / SLIDER_PUZZLE_SIZE),
    };
    return {
      position: position,
      correctPosition: position,
      empty: index === SLIDER_PUZZLE_SIZE * SLIDER_PUZZLE_SIZE - 1,
    };
  });
  /** Randomize order */
  const order = getShuffledArr(puzzle.map((_, i) => i));
  const randomizedPuzzle = [...puzzle].map((p, i) => ({
    ...p,
    position: puzzle[order[i]].correctPosition,
  }));
  return randomizedPuzzle;
}

/** Calculate if the puzzle is solvable by counting inversions */
export function isSolvable(puzzle: Omit<Square, "id">[]): boolean {
  const order = puzzle
    .filter((piece) => !piece.empty)
    .sort((a, b) => count(a.correctPosition) - count(b.correctPosition))
    .map((piece) => count(piece.position));

  const emptyRow = puzzle.find((p) => p.empty)?.position.y;
  if (!emptyRow) throw new Error("Cant find row of empty tile");

  let inv_count = 0;
  for (let i = 0; i < order.length - 1; i++) {
    for (let j = i + 1; j < order.length; j++) {
      if (order[i] > order[j]) inv_count++;
    }
  }

  /** Different logic for odd/even-numbered height
   * https://www.sitepoint.com/randomizing-sliding-puzzle-tiles/
   */
  if (SLIDER_PUZZLE_SIZE % 2 === 1) {
    return inv_count % 2 === 0;
  } else {
    return (inv_count + SLIDER_PUZZLE_SIZE - (emptyRow + 1)) % 2 === 0;
  }
}

export function generatePuzzle() {
  while (true) {
    const puzzle = generatePuzzleSimple();
    const solvable = isSolvable(puzzle);
    if (solvable) return puzzle;
  }
}

const getShuffledArr = <T>(arr: Array<T>): Array<T> => {
  if (arr.length === 1) {
    return arr;
  }
  const rand = Math.floor(Math.random() * arr.length);
  return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
};
