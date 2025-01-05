"use client"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { TextField } from "@mui/material";
import Link from "next/link";
export default function Signin() {

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
      await signIn('credentials',{email : email, password: password});
      alert("Successfully Logged in!!")
      router.push('/')
  }

  return (
    <Suspense fallback={<Loading />}>
    <div className="flex flex-col justify-center min-h-screen">
        <div className="flex justify-center">
          <div className="text-center flex flex-col bg-secondary-200 text-black border border-primary-500 rounded-xl px-20 py-12">
            <div className="font-heading font-bold text-2xl pb-8">Sign in</div>
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
            onClick={handleOnClick}>Signin</div>
          </div>
          <div className="mt-3">
          Don't have an account? <Link href={'/signup'} className="text-blue-500">Register</Link>
          </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
