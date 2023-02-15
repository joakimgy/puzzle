import { Form, Link, useLoaderData } from "@remix-run/react";
import type {
  ActionArgs,
  LoaderArgs,
  LoaderFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getPuzzle } from "~/models/square.server";

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
  console.log(request.formData());
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
