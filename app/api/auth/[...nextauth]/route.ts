import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import User from '@/models/user';
import { connectToDB } from '@/utils/database';
import { sessionInterface, tokenInterface } from '../../../../utils/utils';

//@ts-expect-error unknown error
const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },

      async authorize(credentials) {
        try {
          await connectToDB();
          const user = await User.findOne({ email : credentials?.email });
          if (!user) {
            throw new Error('Invalid email or password');
          }
          const isValid = bcrypt.compare(credentials?.password || " ", user?.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }
          return { email: user.email, id : user.id, name : user.name };
        }
        catch (error : unknown) {
          console.log("Error authorizing credentials: ", error);
          throw new Error('Invalid email or password');
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
  callbacks: {
    async jwt({token, user} : {token : tokenInterface, user : any}){
      if(user){
        token.name = user.name;
        token.email = user.email;
        token.id = user.id.toString();
      }
      return token;
    },
    async session({session, token} : {session : sessionInterface, token : tokenInterface}) {

        if (token && session.user) {
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.id = token.id;
        }

      return session;
    },

    async signIn({ account, credentials } : {account : {provider : string}, credentials : any}) {
      try {
        await connectToDB();

        if(account?.provider === 'credentials') {
          if(!credentials) {
            return false;
          }
          // check if user exists
          const user = await User.findOne({ email: credentials.email });
          if(!user) {
            return false;
          }
          return true;
        }else return false;

      } catch (error: unknown) {
        console.log("Error checking if user exists: ", error);
        return false
      }
    },
  }
})

export { handler as GET, handler as POST }
