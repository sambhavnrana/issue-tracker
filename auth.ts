import NextAuth from "next-auth";
import authOptions from "./app/auth/authOptions";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
