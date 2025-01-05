import { connectToDB } from '@/utils/database';
import Task from '@/models/task';
import User from '@/models/user';

// get all tasks of a user
export const GET = async (request : Request, {params}) => {
    try {
        await connectToDB();
        const param = await params;
        const user = await User.findById(param.userId);
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
         const tasks = await Task.find({userId : param.userId}) || [];
        return new Response(JSON.stringify(tasks), {status : 200});
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
