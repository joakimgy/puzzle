import type { User, Note, PuzzleSquare } from "@prisma/client";

import { prisma } from "~/db.server";
import {
  SLIDER_PUZZLE_SIZE,
  Square,
} from "~/routes/puzzles/sliding_puzzle/utils";

export function getSquare({
  id,
}: Pick<PuzzleSquare, "id"> & {
  userId: User["id"];
}) {
  return prisma.puzzleSquare.findFirst({
    select: { id: true },
    where: { id },
  });
}

export function getAllSquares() {
  return prisma.puzzleSquare.findMany({
    select: { id: true, x: true, y: true, color: true, empty: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPuzzle() {
  const db_squares = await getAllSquares();
  const squares: Square[] = db_squares.map((sq) => {
    const square: Square = {
      position: { x: sq.x, y: sq.y },
      color: sq.color,
      empty: sq.empty,
      id: sq.id,
    };
    return square;
  });
  squares.sort(
    (a, b) =>
      a.position.y * SLIDER_PUZZLE_SIZE +
      a.position.x -
      (b.position.y * SLIDER_PUZZLE_SIZE + b.position.x)
  );

  console.log("Puzzle: ", { squares });

  return squares;
}

export function updateSquare({
  id,
  x,
  y,
}: Pick<PuzzleSquare, "id" | "x" | "y">) {
  return prisma.puzzleSquare.update({
    where: { id },
    data: {
      x: x,
      y: y,
    },
  });
}
