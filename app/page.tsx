"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { findCompletedTasks, findPendingTasks, taskInterface } from "@/utils/utils";
import axios from "axios";
import { formatDate } from "@/utils/utils";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Home() {

  const {data : session, status} = useSession();
  const router = useRouter();
  const [pendingTasks, setPendingTasks] = useState<taskInterface[]>([]);
  const [completedTasks, setCompletedTasks] = useState<taskInterface[]>([]);

  const [addOpen, setAddOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(formatDate(new Date()));

  const [editOpen, setEditOpen] = useState(false);
  const [currEditTask, setCurrEditTask] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDeadline, setEditDeadline] = useState(formatDate(new Date()))

  useEffect(()=>{
    if(status == 'loading')return;
    if(!session){
      router.push('/signin');
    }else {
      axios.get(`/api/task/${session.user?.id}`)
      .then((res)=>{
        const data : [taskInterface] = res.data || [];
        setPendingTasks(findPendingTasks(data));
        setCompletedTasks(findCompletedTasks(data));
      })
      .catch((err)=>{
        console.log(err);
      })
    }
  },[session, status, router])
  
  async function deleteCompletedTask(pt){
    try {
      await axios.delete(`/api/task`, {
        userId : (session?.user.id).toString(),
        taskId : (pt._id).toString()
      })
      alert('Task deleted successfully !!')
    } catch (error) {
     console.log(error);
      alert('Task not deleted!!');
      return;
    }
    const newCompletedTasks = completedTasks.filter((task)=>{
      return task._id != pt._id;
    })
    setPendingTasks(newCompletedTasks);
  }

  async function deletePendingTask(pt){
    try {
      await axios.delete(`/api/task`, {
        userId : (session?.user.id).toString(),
        taskId : (pt._id).toString()
      })
      alert('Task deleted successfully !!')
    } catch (error) {
     console.log(error);
      alert('Task not deleted!!');
      return;
    }
    const newPendingTasks = pendingTasks.filter((task)=>{
      return task._id != pt._id;
    })
    setPendingTasks(newPendingTasks);
  }

  function handleOnClose(){
    setAddOpen(false);
    setDescription('');
    setTaskDeadline(formatDate(new Date()));
  }

  async function completeTask(pt){
    try {
      await axios.put('/api/task',{
        isCompleted : true,
        taskId : pt._id,
        userId : session.user.id 
      })
    } catch (error) {
      console.log(error);
    }
  }

  async function addTask(){
     try {
      await axios.post('/api/task',{
        description : description,
        userId : session.user.id,
        taskDeadline : formatDate(new Date(taskDeadline)) 
      })
    } catch (error) {
      console.log(error);
      alert('Task not added !!')
    }
    window.location.reload();
  }

  function handleEditOpen(pt){
    setEditOpen(true);
    setEditDeadline(pt.taskDeadline);
    setEditDescription(pt.description);
    setCurrEditTask(pt);
  }

  function handleEditClose(){
    setEditOpen(false);
    setEditDeadline(formatDate(new Date()));
    setEditDescription('');
    setCurrEditTask(null);
  }

   async function editTask(){
     try {
      await axios.put(`/api/task`,{
        userId : session?.user.id,
        taskId : currEditTask?._id,
        newDescription : editDescription,
        newDeadline : formatDate(new Date(editDeadline)) 
      })
    } catch (error) {
      console.log(error);
      alert('Task not added !!')
    }
    window.location.reload();
  }



  return (
    <Suspense fallback={<Loading />}>
      <div className="mx-12 py-12">
        <div>
          <div className="flex justify-between pb-6">
            <div className="text-2xl font-bold">Pending tasks</div>
            <div onClick={()=>setAddOpen(true)} href={'/signin'} className="px-2 py-1.5 ml-2 text-md border-2 transition-all duration-300 ease-in-out hover:scale-110 hover:border-green-400 hover:shadow-lg border-green-500 cursor-pointer rounded-md text-green-800">Add task</div>
          </div>
          {pendingTasks.length == 0 ?  
            <div className="text-center">No pending tasks</div> : 
            pendingTasks.map((pt, ind)=>{
              return (<div key={ind} className={`border ${(pt.isCompleted==true) ? ' border-green-600 ' : ' border-red-600 '} flex justify-between px-4`}>
              <div>{pt.description}</div>
              <div className="flex justify-center pr-6">
                {pt.isCompleted==false && <div>{formatDate(new Date(pt.taskDeadline))}</div>}
                <div onClick={()=>completeTask(pt)}><CheckCircleIcon color="success"/></div>
                <div onClick={()=>handleEditOpen(pt)}><EditIcon color="warning"/></div>
                <div onClick={()=>deletePendingTask(pt)}><DeleteIcon color="error"/></div>
              </div>
              </div>)
            })
          }

        </div>
      </div>
      <Modal open={addOpen} onClose={handleOnClose}>
            <div className="flex justify-center">
            <div className="flex flex-col justify-center h-screen">
                <div className="bg-secondary-300 rounded-lg text-background border-2 pt-6 pb-6 w-96">
                    <div className="flex justify-end cursor-pointer px-2">
                        <CloseIcon
                        sx={{ color: 'red', cursor: 'pointer', fontSize: 30 }}
                        color="font-bold text-xl mt-2"
                        onClick={handleOnClose} />
                    </div> 
                    <div className="text-center text-xl">
                      Add a Task
                    </div>
           <div className="mt-6 mb-4 flex justify-center">
            <TextField size="small" id="outlined-basic" label="Description" value={description} onChange={(e)=>setDescription(e.target.value)}
            type="text" variant="outlined" 
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",

              "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
              borderWidth: "1px",
              borderRadius : "4px"
              },
            },
              "& .MuiInputLabel-outlined": {
              color: "#000", 
              borderRadius : "4px"
            },
           }}  
          className="border w-64 border-primary-500 rounded-lg" />
          </div>

           <div className="mt-6 mb-4 flex justify-center">
            <TextField  size="small" id="outlined-basic" label="Deadline" value={taskDeadline} onChange={(e)=>setTaskDeadline(e.target.value)}
            type="date" variant="outlined" 
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",

              "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
              borderWidth: "1px",
              borderRadius : "4px"
              },
            },
              "& .MuiInputLabel-outlined": {
              color: "#000", 
              borderRadius : "4px"
            },
           }}  
          className="border border-primary-500 w-64 rounded-lg" />
          </div>

                        <div className="flex justify-center text-black font-heading">
                          <div className="border-2 border-primary-500 rounded-lg px-3 py-2 my-4  transition-all duration-300 ease-in-out hover:scale-110 hover:border-primary-400 hover:shadow-lg cursor-pointer" onClick={addTask}>Add Task</div>
                        </div>
                </div>
            </div>
            </div>
      </Modal>


      <Modal open={editOpen} onClose={handleEditClose}>
            <div className="flex justify-center">
            <div className="flex flex-col justify-center h-screen">
                <div className="bg-secondary-300 rounded-lg text-background border-2 pt-6 pb-6 w-96">
                    <div className="flex justify-end cursor-pointer px-2">
                        <CloseIcon
                        sx={{ color: 'red', cursor: 'pointer', fontSize: 30 }}
                        color="font-bold text-xl mt-2"
                        onClick={handleEditClose} />
                    </div> 
                    <div className="text-center text-xl">
                      Edit task
                    </div>
           <div className="mt-6 mb-4 flex justify-center">
            <TextField size="small" id="outlined-basic" label="Description" value={editDescription} onChange={(e)=>setEditDescription(e.target.value)}
            type="text" variant="outlined" 
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",

              "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
              borderWidth: "1px",
              borderRadius : "4px"
              },
            },
              "& .MuiInputLabel-outlined": {
              color: "#000", 
              borderRadius : "4px"
            },
           }}  
          className="border w-64 border-primary-500 rounded-lg" />
          </div>

           <div className="mt-6 mb-4 flex justify-center">
            <TextField  size="small" id="outlined-basic" label="Deadline" value={editDeadline} onChange={(e)=>setEditDeadline(e.target.value)}
            type="date" variant="outlined" 
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",

              "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
              borderWidth: "1px",
              borderRadius : "4px"
              },
            },
              "& .MuiInputLabel-outlined": {
              color: "#000", 
              borderRadius : "4px"
            },
           }}  
          className="border border-primary-500 w-64 rounded-lg" />
          </div>

                        <div className="flex justify-center text-black font-heading">
                          <div className="border-2 border-primary-500 rounded-lg px-3 py-2 my-4  transition-all duration-300 ease-in-out hover:scale-110 hover:border-primary-400 hover:shadow-lg cursor-pointer" onClick={editTask}>Edit Task</div>
                        </div>
                </div>
            </div>
            </div>
      </Modal>
    </Suspense>
  );
}
