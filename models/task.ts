import { Schema, model, models} from 'mongoose';
import mongoose from 'mongoose'

const TaskSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,   

        ref: 'User',
        required: [true, 'User Id is required!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
    },
    taskDeadline : {
      type : Date,
      required : [true, 'Deadline is required!'],
    },
    isCompleted : {
      type : Boolean,
      default : false,
    }
});

const Task = models.Task || model("Task", TaskSchema);

export default Task;
