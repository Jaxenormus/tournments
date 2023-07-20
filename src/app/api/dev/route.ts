import { getBaseUrl } from "@/utils/getBaseUrl";
import { NextResponse } from "next/server";

export const GET = () => {
  const uid = "user_nrxHyu5XRFjkS";
  const at = "gU6gHk7NTpouvCSlN9DlvVn6RyhHtmqzpCWklJ9J_jI";
  const eid = "exp_aBvfK4qVDMkKEs";

  const res = NextResponse.redirect(`${getBaseUrl()}/admin`);

  res.cookies.set("tourney_uid", uid, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });
  res.cookies.set("tourney_eid", eid, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });
  res.cookies.set("tourney_at", at, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });

  return res;
};
