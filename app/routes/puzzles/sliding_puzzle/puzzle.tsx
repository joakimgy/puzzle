import { useSubmit } from "@remix-run/react";
import type { Square } from "./utils";

const imageResolution = 1000;
const imageUrl = `https://images.unsplash.com/photo-1598214886806-c87b84b7078b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=${imageResolution}&q=80&h=${imageResolution}&q=80`;

const SlidingPuzzle = ({ puzzle }: { puzzle: Square[] }) => {
  const submit = useSubmit();

  function move(square: Square) {
    let formData = new FormData();
    formData.append("square_id", square.id);
    submit(formData, { method: "post", action: "/puzzles/sliding_puzzle" });
  }

  // Tailwind sizes (1 = 0.25rem)
  const height = 44;
  const heightRem = height / 4;
  const gapRem = 4;
  const tiles = 3;
  const percentageOffset = 100 / (tiles - 1);

  return (
    <div
      className={`border-1 grid grid-cols-${tiles} grid-rows-${tiles} gap-${gapRem}`}
    >
      {puzzle.map((square) => (
        <div className={`h-${height} w-${height}`} key={`div-${square.id}`} />
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
            <>
              <div
                className={`absolute h-${height} w-${height}`}
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${heightRem * tiles}rem`,
                  backgroundPositionX: `${
                    square.correctPosision.x * percentageOffset
                  }%`,
                  backgroundPositionY: `${
                    square.correctPosision.y * percentageOffset
                  }%`,
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
