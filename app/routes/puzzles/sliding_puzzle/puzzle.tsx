import { useSubmit } from "@remix-run/react";
import type { Square } from "./utils";

const widthHeight = 176;
const imageUrl = `https://images.unsplash.com/photo-1598214886806-c87b84b7078b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=${
  widthHeight * 3
}&q=80&h=${widthHeight * 3}&q=80`;

const SlidingPuzzle = ({ puzzle }: { puzzle: Square[] }) => {
  const submit = useSubmit();

  function move(square: Square) {
    let formData = new FormData();
    formData.append("square_id", square.id);
    submit(formData, { method: "post", action: "/puzzles/sliding_puzzle" });
  }

  puzzle.forEach((sq) => console.log(sq.correctPosision, sq.empty));

  return (
    <div className="border-1 grid grid-cols-3 grid-rows-3 gap-4">
      {puzzle.map((square) => (
        <div className="h-44 w-44" key={`div-${square.id}`} />
      ))}
      {puzzle.map((square, index) => (
        <button
          className={`absolute transition-transform`}
          style={{ transform: getTranslation(square.position) }}
          key={square.id}
          onClick={() => {
            move(square);
          }}
        >
          {!square.empty && (
            <>
              <div
                className="absolute h-44 w-44"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPositionX: square.correctPosision.x * widthHeight,
                  backgroundPositionY: square.correctPosision.y * widthHeight,
                }}
              />
              <p className={`h-44 w-44 ${square.color}`}>
                {getLabel(square.correctPosision)}
              </p>
            </>
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
