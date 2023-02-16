import { useSubmit } from "@remix-run/react";
import type { Square } from "./utils";

const SlidingPuzzle = ({ puzzle }: { puzzle: Square[] }) => {
  const submit = useSubmit();

  function move(square: Square) {
    let formData = new FormData();
    formData.append("square_id", square.id);
    submit(formData, { method: "post", action: "/puzzles/sliding_puzzle" });
  }

  return (
    <div className="border-1 grid grid-cols-3 grid-rows-3 gap-4">
      {puzzle.map((square) => (
        <div className="h-44 w-44" key={`div-${square.id}`} />
      ))}
      {puzzle.map((square) => (
        <button
          className={`absolute transition-transform`}
          style={{ transform: getTranslation(square.position) }}
          key={square.id}
          onClick={() => {
            move(square);
          }}
        >
          {!square.empty && (
            <p className={`h-44 w-44 ${square.color}`}>
              {getLabel(square.correctPosision)}
            </p>
          )}
        </button>
      ))}
    </div>
  );
};

function getTranslation(position: { x: number; y: number }) {
  return `translate(${position.x * (11 + 1)}rem, ${position.y * (11 + 1)}rem)`;
}

function getLabel(position: { x: number; y: number }) {
  return `${position.y}, ${position.x}`;
}

export default SlidingPuzzle;
