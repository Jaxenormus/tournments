import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { cookies, headers } from "next/dist/client/components/headers";

export const getRouteAuthSession = async () => {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { getHeader() {}, setCookie() {}, setHeader() {} };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
  const session = await getServerSession(req, res, authOptions);
  return session;
};
