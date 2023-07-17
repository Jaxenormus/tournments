import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const GET = (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");
  return redirect(`/api/auth/callback/whop?code=${code}`);
};
