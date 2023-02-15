export const SLIDER_PUZZLE_SIZE = 3;
export function initPuzzle(): Omit<Square, "id">[] {
  return Array.from(Array(SLIDER_PUZZLE_SIZE * SLIDER_PUZZLE_SIZE).keys()).map(
    (index) => ({
      position: {
        x: index % SLIDER_PUZZLE_SIZE,
        y: Math.floor(index / SLIDER_PUZZLE_SIZE),
      },
      color: colors[index],
      empty: index === SLIDER_PUZZLE_SIZE,
    })
  );
}

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
