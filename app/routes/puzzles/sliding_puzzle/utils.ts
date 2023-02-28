export const SLIDER_PUZZLE_SIZE = 3;

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
  newPuzzle.sort(
    (a, b) =>
      a.position.y * SLIDER_PUZZLE_SIZE +
      a.position.x -
      (b.position.y * SLIDER_PUZZLE_SIZE + b.position.x)
  );
  return newPuzzle;
}

export type Square = {
  position: { x: number; y: number };
  correctPosition: { x: number; y: number };
  id: string;
  color: string;
  empty: boolean;
};

export const colors = [
  "bg-red-400",
  "bg-green-400",
  "bg-blue-400",
  "bg-red-600",
  "bg-green-600",
  "bg-blue-600",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
];

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
      color: colors[index],
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

function countInversions(puzzle: Omit<Square, "id">[]) {
  const order = puzzle
    .filter((piece) => !piece.empty)
    .map((piece) => piece.position.y * SLIDER_PUZZLE_SIZE + piece.position.x);

  let inv_count = 0;
  for (let i = 0; i < order.length - 1; i++) {
    for (let j = i + 1; j < order.length; j++) {
      if (order[i] > order[j]) inv_count++;
    }
  }
  return inv_count;
}

export function generatePuzzle() {
  while (true) {
    const puzzle = generatePuzzleSimple();
    const inversions = countInversions(puzzle);
    console.log({ inversions });
    if (inversions % 2 === 0) return puzzle;
  }
}

const getShuffledArr = <T>(arr: Array<T>): Array<T> => {
  if (arr.length === 1) {
    return arr;
  }
  const rand = Math.floor(Math.random() * arr.length);
  return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
};
