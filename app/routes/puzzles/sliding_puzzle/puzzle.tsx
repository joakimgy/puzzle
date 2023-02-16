import { useSubmit } from "@remix-run/react";
import type { Square } from "./utils";
import { isAdjacentToEmpty } from "./utils";

const SlidingPuzzle = ({ puzzle }: { puzzle: Square[] }) => {
  const submit = useSubmit();

  function move(square: Square) {
    const isAdjacent = isAdjacentToEmpty(square, puzzle);
    if (!isAdjacent) return;
    let formData = new FormData();
    formData.append("square_id", square.id);
    submit(formData, { method: "post", action: "/puzzles/sliding_puzzle" });
  }

  return (
    <div className="border-1 grid grid-cols-3 grid-rows-3 gap-4">
      {puzzle.map((square) => (
        <button
          key={square.id}
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
