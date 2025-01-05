"use client"

import { Modal } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { findCompletedTasks, findTotalTasks } from "@/utils/utils";
import axios from "axios";
export default function Navbar() {

  const {data : session, status} = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [userTasks, setUserTasks] = useState(null);
  useEffect(()=>{
    if(status == 'loading')return;
    if(!session){
      router.push('/signin');
    }
  },[session, status, router])
 
  async function handleLogout(){
    setOpen(false);
    await signOut({redirect: false});
    router.push('/signin');
  }

  function handleOnClose(){
    setOpen(false);
  }

  async function handleOnClick(){
    try{
      if(session){
      setOpen(true);
      const {data} = await axios.get(`/api/task/${session?.user?.id}`);
      setUserTasks(data);
      }
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className="py-5  border border-b-secondary-500 shadow-lg">
      <div className="flex flex-col justify-center mx-7">
      <div className="flex justify-between">
        <div className="text-2xl flex flex-col justify-center font-bold">Task Manager</div>
        <div>
          {
            !session ?
          <div>
            <Link href={'/signin'} className="px-2 py-1.5 ml-2 text-md border-2 transition-all duration-300 ease-in-out hover:scale-125 hover:border-primary-400 hover:shadow-lg border-primary-500 cursor-pointer rounded-md">Sign in</Link>
          </div> 
            :
          <div 
          onClick={handleOnClick}
          className="px-2.5 py-1 flex ml-2 flex-col justify-center rounded-full border-2 transition-all duration-300 ease-in-out hover:scale-110 hover:border-primary-400 hover:shadow-lg border-primary-500 cursor-pointer text-xl font-bold ">
            {session?.user?.name && session?.user.name[0].toUpperCase() || "U"}
          </div>
          }
        </div>
      </div>
      </div>
      <Modal open={open} onClose={handleOnClose}>
            <div className="flex justify-center">
            <div className="flex flex-col justify-center h-screen">
                <div className="bg-secondary-300 rounded-lg text-background border-2 pt-4 pb-6 w-96">
                    <div className="flex justify-end cursor-pointer px-2">
                        <CloseIcon
                        sx={{ color: 'red', cursor: 'pointer', fontSize: 30 }}
                        color="font-bold text-xl mt-2"
                        onClick={handleOnClose} />
                    </div>           
                    {session && <div>
                        <div className="flex justify-center">
                         <div className="text-center text-black text-3xl px-6 py-3 my-8 rounded-full border-2 border-primary-500 font-heading">{session?.user.name[0].toUpperCase()}</div>
                        </div>
                        <div className="text-center font-heading font-medium text-xl text-black">{session?.user.name}</div>
                      {
                      userTasks && 
                        <div className="text-center">
                          <div className="pt-2"><span className="font-semibold">Total No. of tasks :</span> {findTotalTasks(userTasks)} </div>
                          <div className="pt-2"><span className="font-semibold">No. of completed tasks :</span> {findCompletedTasks(userTasks).length} </div>
                        </div>
                        
                      }
                        <div className="flex justify-center text-red-500 font-heading">
                          <div className="border-2 border-red-500 rounded-lg px-3 py-2 my-4  transition-all duration-300 ease-in-out hover:scale-110 hover:border-red-400 hover:shadow-lg cursor-pointer " onClick={handleLogout}>Log Out</div>
                        </div>
                    </div>}
                </div>
            </div>
            </div>
      </Modal>
    </div>
  );
}
