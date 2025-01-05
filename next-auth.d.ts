declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
    name?: string
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string
  }
}
