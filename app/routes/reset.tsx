import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { resetPuzzle } from "~/models/square.server";

import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  return resetPuzzle({ userId });
}

export async function loader() {
  return redirect("/puzzles/sliding_puzzle");
}
