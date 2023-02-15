import { Form, useSubmit } from "@remix-run/react";
import React, { FormEventHandler, useEffect, useState } from "react";
import { initPuzzle, isAdjacentToEmpty, moveSquare, Square } from "./utils";

const SlidingPuzzle = ({ puzzle }: { puzzle: Square[] }) => {
  const submit = useSubmit();

  function move(square: Square) {
    const isAdjacent = isAdjacentToEmpty(square, puzzle);
    if (!isAdjacent) return;
    const newPuzzle = moveSquare(puzzle, square);
    console.log("submitting");
    submit(null, { method: "post", action: "/puzzles/sliding_puzzle" });
    //setPuzzle(newPuzzle);
  }

  return (
    <div className="border-1 grid grid-cols-3 grid-rows-3 gap-4">
      {puzzle.map((square) => (
        <button
          key={Math.random()}
          onClick={() => {
            move(square);
          }}
        >
          {!square.empty && <p className={`p-10 ${square.color}`}>X</p>}
        </button>
      ))}
    </div>
  );
};

export default SlidingPuzzle;
