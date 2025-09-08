'use client'
import LoginForm from "@/components/LoginForm";
import { setToken } from "@/middlewares/generateToken";
import { useTitle } from "@/utils/customHook";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  // const [forgot, setForgot] = useState(false)
  const [loading, setLoading] = useState(false)
  useTitle("Notes App | Login"); // To set title for pages, separate function

    const handleLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await axios.post('/api/auth/login', data);
            setToken(response.data.token);
            window.location.href = "/dashboard" // This is to force reload of the page, so that the navbar can fetch the user image again on mount.
            // router.push("/dashboard"); // this doesn't reload the page.
            localStorage.setItem('justLoggedIn', '1') // to show only when he log's in and not on subsequent visit to dashboard page
        } catch (error) {
          toast.error(error?.response?.data?.message || "Account Not Registered.");
        }
    };

    const handleForgotPassword = async (e) =>{
      setLoading(true)
      e.preventDefault()
      const formData = new FormData(e.target)
      const data = Object.fromEntries(formData)

      try {
        const res = await axios.post('/api/auth/forgot', {data})
        toast.success( res.data?.msg || "Check Your Email", {autoClose: 1500})
        setTimeout(() => window.location.href='/login', 1600)
      } catch (err) {
        console.log("Error in forgot password",err)
        toast.error(err?.response?.data?.msg || "User Doesn't Exist")
        setTimeout(() => router.push('/signup'), 2000 )
      }
      
    }

    return (
        <>
        <LoginForm handleLogin={handleLogin} handleForgotPassword={handleForgotPassword} loading={loading} />
       </>
    );
};

export default Login;
