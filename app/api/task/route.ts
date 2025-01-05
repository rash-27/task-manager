import { connectToDB } from '@/utils/database';
import Task from '@/models/task';
import User from '@/models/user';

// Create a task
export const POST = async (request : any) => {
    const { userId, description, taskDeadline } = await request.json();
    try {
        await connectToDB();
        const user = await User.findById(userId);
        if (!user) {
            return new Response("Invalid user", { status: 400 });
        }
        const newTask = new Task({ userId : userId, description : description, taskDeadline : taskDeadline});
        await newTask.save();
        return new Response("Task Created", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}


 // update task of a user 
export const PUT = async (request : any) => {
    const { userId, taskId, newDescription, newDeadline, isCompleted } = await request.json();
    try {
        await connectToDB();
        const user = await User.findById(userId);
        if (!user) {
            return new Response("Invalid user", { status: 400 });
        }
        const oldTask = await Task.findOne({_id : taskId, userId : userId});
        if(newDescription){
          oldTask.description = newDescription;
        }
        if(newDeadline){
          oldTask.taskDeadline = newDeadline;
        }
        if(isCompleted){
          oldTask.isCompleted = isCompleted;
        }
        await oldTask.save();
        return new Response("Task updated", {status : 200});
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}

// Delete task of a user 
export const DELETE = async (request : any) => {
    const { userId, taskId } = await request.json();
    try {
        await connectToDB();
        const user = await User.findById(userId);
        if (!user) {
            return new Response("Invalid user", { status: 400 });
        }
        await Task.deleteOne({userId : userId, _id : taskId});
        return new Response("Task Deleted", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}
