import React, { useEffect, useState } from "react";
import { initPuzzle, isAdjacentToEmpty, moveSquare, Square } from "./utils";

const SlidingPuzzle = () => {
  const [puzzle, setPuzzle] = useState<Square[]>(() => initPuzzle());

  function move(square: Square) {
    console.log("Current puzzle: ", JSON.stringify(puzzle));
    const isAdjacent = isAdjacentToEmpty(square, puzzle);
    if (!isAdjacent) return;
    const newPuzzle = moveSquare(puzzle, square);
    console.log("New: ", JSON.stringify(newPuzzle));
    setPuzzle(newPuzzle);
  }

  console.log("rerender");

  return (
    <div className="">
      <div className="border-1 grid grid-cols-3 grid-rows-3 gap-4">
        {puzzle.map((square) => (
          <button
            type="button"
            key={Math.random()}
            onClick={() => {
              console.log("onClick");

              move(square);
            }}
          >
            {!square.empty && <p className={`p-10 ${square.color}`}>X</p>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlidingPuzzle;
