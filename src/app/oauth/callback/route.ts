import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "../../../../prisma";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");
  const redirectUri = req.nextUrl.searchParams.get("redirectUri");
  const experienceId = req.nextUrl.searchParams.get("experienceId");

  if (!code || !experienceId || !redirectUri) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const oauth = await fetch("https://data.whop.com/api/v3/oauth/token", {
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

  const { access_token } = (await oauth.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    created_at: number;
  };

  const me = await fetch("https://api.whop.com/api/v2/info", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const {
    user: { id, username },
  } = (await me.json()) as {
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
  };

  const url = new URL(redirectUri);

  const user = await prisma.user.upsert({
    where: { id },
    create: {
      id,
      name: username,
    },
    update: {
      name: username,
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
  res.cookies.set("tourney_at", access_token, cookieOptions);

  return res;
};
