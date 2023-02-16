import { Form, Link, useLoaderData } from "@remix-run/react";
import type {
  ActionArgs,
  LoaderArgs,
  LoaderFunction,
} from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getPuzzle, updateSquare } from "~/models/square.server";
import { requireUserId } from "~/session.server";

import { useUser } from "~/utils";
import SlidingPuzzle from "./puzzle";
import type { Square } from "./utils";

type LoaderData = {
  puzzle: Square[];
};
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const puzzle = await getPuzzle({ userId });
  return json({ puzzle });
};

export async function action({ request }: ActionArgs) {
  console.log("action!");

  const formData = await request.formData();
  const userId = await requireUserId(request);
  console.log("Submitted: ", formData);

  const square_id = formData.get("square_id")?.toString();
  if (!square_id) return null;

  const puzzle = await getPuzzle({ userId });
  const emptyPos = puzzle.find((sq) => sq.empty);
  const clickedPos = puzzle.find((sq) => sq.id === square_id);

  if (!emptyPos || !clickedPos) return null;
  await updateSquare({
    id: emptyPos.id,
    x: clickedPos.position.x,
    y: clickedPos.position.y,
    userId,
  });
  await updateSquare({
    id: square_id,
    x: emptyPos.position.x,
    y: emptyPos.position.y,
    userId,
  });

  return redirect(`/puzzles/sliding_puzzle`);
}

export default function SlidingPuzzlePage() {
  const user = useUser();
  const { puzzle } = useLoaderData() as LoaderData;

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Puzzles</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/reset" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Reset puzzle
          </button>
        </Form>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="container mx-auto grid items-center justify-items-center bg-blue-200">
          <SlidingPuzzle puzzle={puzzle} />
        </div>
      </main>
    </div>
  );
}
