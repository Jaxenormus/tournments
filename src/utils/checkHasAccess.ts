import type { Session } from "next-auth";
import axios from "axios";

interface HasAccessResponse {
  valid: true;
  authorized_user?: {
    role: "owner" | "admin" | "moderator";
    permission_level: 0 | 1 | 2;
  };
}

export const checkHasAccess = async (session: Session, isAdmin: boolean) => {
  if (isAdmin) {
    try {
      const res = await axios<HasAccessResponse>(
        `https://api.whop.com/api/v2/me/has_access/${process.env.RESOURCE_ID}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );

      return res.data.authorized_user?.permission_level === 0;
    } catch (e) {
      return false;
    }
  } else {
    return true;
  }
};
