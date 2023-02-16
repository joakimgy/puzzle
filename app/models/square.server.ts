import type { User, PuzzleSquare } from "@prisma/client";

import { prisma } from "~/db.server";
import type { Square } from "~/routes/puzzles/sliding_puzzle/utils";
import {
  initPuzzle,
  SLIDER_PUZZLE_SIZE,
} from "~/routes/puzzles/sliding_puzzle/utils";

export function getSquare({
  id,
}: Pick<PuzzleSquare, "id"> & {
  userId: User["id"];
}) {
  return prisma.puzzleSquare.findFirst({
    select: { id: true, x: true, y: true, empty: true, color: true },
    where: { id },
  });
}

export function getAllSquares({ userId }: Pick<PuzzleSquare, "userId">) {
  return prisma.puzzleSquare.findMany({
    where: { userId },
    select: { id: true, x: true, y: true, color: true, empty: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPuzzle({ userId }: Pick<PuzzleSquare, "userId">) {
  const db_squares = await getAllSquares({ userId });
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

  return squares;
}

export function updateSquare({
  id,
  x,
  y,
  // TODO: Add user id here?
  userId,
}: Pick<PuzzleSquare, "id" | "x" | "y" | "userId">) {
  console.log("Update square");
  return prisma.puzzleSquare.update({
    where: { id: id },
    data: {
      x: x,
      y: y,
    },
  });
}

export async function resetPuzzle({ userId }: Pick<PuzzleSquare, "userId">) {
  // TODO: Add user id on delete?
  await prisma.puzzleSquare.deleteMany({});
  return initPuzzle().map(async (sq) => {
    await prisma.puzzleSquare.create({
      data: {
        x: sq.position.x,
        y: sq.position.y,
        empty: sq.empty,
        color: sq.color,
        userId: userId,
      },
    });
  });
}
