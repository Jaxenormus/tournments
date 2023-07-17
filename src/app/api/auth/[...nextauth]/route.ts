import type { AuthOptions, DefaultSession } from "next-auth";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string; token: string } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "whop",
      name: "Whop",
      type: "oauth",
      authorization: { url: "https://whop.com/oauth" },
      token: "https://api.whop.com/api/v3/oauth/token",
      userinfo: "https://api.whop.com/api/v2/me",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.profile_pic_url,
        };
      },
      clientId: process.env.WHOP_CLIENT_ID,
      clientSecret: process.env.WHOP_CLIENT_SECRET,
      checks: [],
    },
  ],
  callbacks: {
    async session({ session, token }) {
      // throw new Error("beans");
      if (session) {
        session.user.id = token.sub as string;
        session.user.token = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },
  
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
