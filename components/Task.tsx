import { formatDate, taskInterface } from "@/utils/utils";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export default function Task(singleTask : taskInterface){
  
  async function handleOnClick

  return <div className={`border ${(singleTask.isCompleted==true) ? ' border-green-600 ' : ' border-red-600 '} flex justify-between px-4`}>
      <div>{singleTask.description}</div>
      <div className="flex justify-center">
        {singleTask.isCompleted==false && <div>{formatDate(new Date(singleTask.taskDeadline))}</div>}
        <div><EditIcon color="warning"/></div>
        <div onClick={handleOnClick}><DeleteIcon color="error"/></div>
      </div>
      
  </div>
}
