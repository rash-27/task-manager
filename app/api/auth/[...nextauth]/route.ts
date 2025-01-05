import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import User from '@/models/user';
import { connectToDB } from '@/utils/database';

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
          const user = await User.findOne({ email : credentials.email });
          if (!user) {
            throw new Error('Invalid email or password');
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }
          return { email: user.email, username: user.username, image: user.image };
        }
        catch (error) {
          console.log("Error authorizing credentials: ", error.message);
          throw new Error('Invalid email or password');
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
  callbacks: {
    async session({ session }) {
      // store the user id, name from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.name = sessionUser.name;
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
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

      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
})

export { handler as GET, handler as POST }
