import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createNewPuzzle } from "~/models/square.server";

import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  return createNewPuzzle({ userId });
}

export async function loader() {
  return redirect("/puzzles/sliding_puzzle");
}
