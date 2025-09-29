import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/utils/mongoClient";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          profilePicUrl: profile.picture,
          isVerified: true,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("User signed in: BEEEE", user, account);

      if (account?.provider === "google") {
        user.isVerified = true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.profilePicUrl = user.profilePicUrl;
        token.isVerified = user.isVerified;
        token.phoneNumber = user.phoneNumber;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        profilePicUrl: token.profilePicUrl,
        isVerified: token.isVerified,
        phoneNumber: token.phoneNumber,
      };
      return session;
    },

    async redirect({ url }) {
      if (url.includes("/login")) {
        return process.env.NEXT_PUBLIC_FE_API_URL + "/login";
      }

      if (url == "/login") {
        return process.env.NEXT_PUBLIC_FE_API_URL + "/dashboard";
      }

      return url;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
