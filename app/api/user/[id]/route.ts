import bcrypt from 'bcryptjs';
import { connectToDB } from '@/utils/database';
import User from '@/models/user';

// Update password and name of user
export const PUT = async (req : Request, {params}) => {
    const { oldPassword, newPassword, name } = await req.json();
    
    try {
        await connectToDB();
        const param = await params;
        const user = await User.findById(param.id);
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
        if(oldPassword){
          const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
          if (!isPasswordValid) {
            return new Response('Invalid password', { status: 401 });
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
        }else {
          user.name = name;
        }
        await user.save();
        return new Response('User details updated', { status: 200 });
    } catch (error : unknown) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}

// Get the user data
export const GET = async (req : Request, {params}) => {
    try {
        await connectToDB();
        const param = await params;
        const user = await User.findById(param.id);
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
        return new Response(JSON.stringify({name : user.name, email : user.email}), { status: 200 });
    } catch (error : unknown) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
