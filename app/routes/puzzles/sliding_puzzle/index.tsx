import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import {
  ActionArgs,
  LoaderArgs,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getPuzzle, updateSquare } from "~/models/square.server";

import { useUser } from "~/utils";
import SlidingPuzzle from "./puzzle";
import type { Square } from "./utils";

type LoaderData = {
  puzzle: Square[];
};
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const puzzle = await getPuzzle();
  return json({ puzzle });
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  console.log("Submitted: ", formData);

  const id = "cle69skaj0006vprxotuctmby";

  const puzzle = await getPuzzle();
  const emptyPos = puzzle.find((sq) => sq.empty);
  const clickedPos = puzzle.find((sq) => sq.id === id);

  if (!emptyPos || !clickedPos) return null;
  await updateSquare({
    id: emptyPos.id,
    x: clickedPos.position.x,
    y: clickedPos.position.y,
  });
  await updateSquare({
    id,
    x: emptyPos.position.x,
    y: emptyPos.position.y,
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
