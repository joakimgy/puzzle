import { useSubmit } from "@remix-run/react";
import type { Square } from "./utils";
import { SLIDER_PUZZLE_SIZE } from "./utils";

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
  const gap = 4;
  const percentageOffset = 100 / (SLIDER_PUZZLE_SIZE - 1);

  return (
    <div
      className={"border-1 grid gap-4"}
      style={{
        gridTemplateColumns: `repeat(${SLIDER_PUZZLE_SIZE}, minmax(0, 1fr))`,
      }}
    >
      {puzzle.map((square) => (
        <div className={`h-44 w-44 `} key={`div-${square.id}`} />
      ))}
      {puzzle.map((square) => (
        <button
          className={`absolute transition-transform`}
          style={{
            transform: getTranslation(
              square.position,
              (height + gap) / SLIDER_PUZZLE_SIZE
            ),
          }}
          key={square.id}
          onClick={() => {
            move(square);
          }}
        >
          {!square.empty && (
            <>
              <div
                className={`absolute h-44 w-44`}
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${(height / 4) * SLIDER_PUZZLE_SIZE}rem`,
                  backgroundPositionX: `${
                    square.correctPosition.x * percentageOffset
                  }%`,
                  backgroundPositionY: `${
                    square.correctPosition.y * percentageOffset
                  }%`,
                }}
              />
              <p className="absolute h-44 w-44 text-white">
                {square.correctPosition.y} {square.correctPosition.x}
              </p>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

function getTranslation(
  position: {
    x: number;
    y: number;
  },
  tileSizeRem: number
) {
  return `translate(${position.x * tileSizeRem}rem, ${
    position.y * tileSizeRem
  }rem)`;
}

export default SlidingPuzzle;
