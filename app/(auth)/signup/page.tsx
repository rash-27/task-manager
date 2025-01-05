"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { TextField } from "@mui/material";
import Link from "next/link";
import axios from "axios";
export default function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {data : session, status} = useSession();
  const router = useRouter();
  useEffect(()=>{
    if(status == 'loading')return;
    if(session){
      router.push('/');
    }
  },[session, status, router])

  async function handleOnClick(){
    try {
      await axios.post('/api/user',{
        email : email,
        name : name,
        password : password,
        
      })
      alert('Successfully registered! now you can login!')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col justify-center min-h-screen">
        <div className="flex justify-center">
          <div className="text-center flex flex-col bg-secondary-200 text-black border border-primary-500 rounded-xl px-20 py-12">
            <div className="font-heading font-bold text-2xl pb-8">Register</div>
            <div className="pb-6">
            <TextField size="small" id="outlined-basic" label="Email" value={email} onChange={(e)=>setEmail(e.target.value)}
            type="text" variant="outlined" 
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",
              fontWeight: "bold",

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
          className="border border-primary-500 rounded-lg" />
          </div>
          <div className="pb-6">
            <TextField size="small" id="outlined-basic" label="Name" value={name} onChange={(e)=>setName(e.target.value)}
            type="text" variant="outlined" 
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",
              fontWeight: "bold",

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
          className="border border-primary-500 rounded-lg" />
          </div>
          <div className="pb-6">
          <TextField size="small" id="outlined-adornment-password" label="Password" 
            type="password" variant="outlined"
            value={password} onChange={(e)=>setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",
              fontWeight: "bold",

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
          className="border rounded-lg" />
          </div>

          <div className={` flex justify-center text-white`}>
          <div className="font-normal bg-primary-500 text-white px-3 py-1.5 rounded-md  transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary-400 hover:shadow-lg cursor-pointer "
            onClick={handleOnClick}>Register</div>
          </div>
          <div className="mt-3">
          Already have an account? <Link href={'/signin'} className="text-blue-500">Signin</Link>
          </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
