const size = 3;
export function initPuzzle(): Square[] {
  console.log("Init puzzle");
  return Array.from(Array(size * size).keys()).map((index) => ({
    position: { x: index % size, y: Math.floor(index / size) },
    id: index,
    color: colors[index],
    empty: index === size,
  }));
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
  console.log({ squareIndex, emptySquareIndex });
  let newPuzzle = puzzle;

  newPuzzle[squareIndex] = { ...square, position: emptySquare.position };
  newPuzzle[emptySquareIndex] = { ...emptySquare, position: square.position };
  newPuzzle.sort(
    (a, b) =>
      a.position.y * size + a.position.x - (b.position.y * size + b.position.x)
  );
  return newPuzzle;
}

export type Square = {
  position: { x: number; y: number };
  id: number;
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