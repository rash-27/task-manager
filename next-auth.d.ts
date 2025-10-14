import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
    name?: string
  } 

  interface Session extends DefaultSession {
    user?: User & DefaultSession['user'];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string
  }
}
