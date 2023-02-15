import { Form, Link, useCatch } from "@remix-run/react";

import { useUser } from "~/utils";
import SlidingPuzzle from "./puzzle";

export default function SlidingPuzzlePage() {
  const user = useUser();

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
          <SlidingPuzzle />
        </div>
      </main>
    </div>
  );
}
