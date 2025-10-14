import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware"; 

export default async function middleware(req: NextRequestWithAuth) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;
    if(!token){
        return NextResponse.redirect(new URL('/signin', req.url));
    }
}

export const config = {
  matcher: ["/"],
};