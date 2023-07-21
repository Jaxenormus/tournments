import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/prisma";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { captureException } from "@sentry/nextjs";

export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");
  const redirectUri = req.nextUrl.searchParams.get("redirectUri");
  const experienceId = req.nextUrl.searchParams.get("experienceId");

  if (!code || !experienceId || !redirectUri) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const oauth = await fetch(`${process.env.WHOP_API_URL}/api/v3/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: process.env.WHOP_CLIENT_ID,
      client_secret: process.env.WHOP_CLIENT_SECRET,
    }),
  });

  const oauthData = (await oauth.json()) as
    | {
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
        created_at: number;
      }
    | { error: { status: number; message: string } };

  if ("error" in oauthData) {
    captureException(oauthData.error);
    const url = new URL(redirectUri);
    url.pathname = "/no-access";
    return NextResponse.redirect(url);
  }

  const me = await fetch(`${process.env.WHOP_API_URL}/api/v2/oauth/info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${oauthData.access_token}`,
    },
  });

  const meData = (await me.json()) as
    | {
        user: {
          id: string;
          username: string;
          email: string;
          profile_pic_url: string;
          social_accounts: {
            service: string;
            username: string;
            id: string;
          }[];
        };
      }
    | { error: { status: number; message: string } };

  if ("error" in meData) {
    captureException(meData.error);
    const url = new URL(redirectUri);
    url.pathname = "/no-access";
    return NextResponse.redirect(url);
  }

  const url = new URL(redirectUri);

  const user = await prisma.user.upsert({
    where: { id: meData.user.id },
    create: {
      id: meData.user.id,
      name: meData.user.username,
    },
    update: {
      name: meData.user.username,
    },
  });

  const res = NextResponse.redirect(url);

  const cookieOptions: Partial<ResponseCookie> = {
    secure: true,
    sameSite: "none",
    httpOnly: true,
  };

  res.cookies.set("tourney_uid", user.id, cookieOptions);
  res.cookies.set("tourney_eid", experienceId, cookieOptions);
  res.cookies.set("tourney_at", oauthData.access_token, cookieOptions);

  return res;
};
