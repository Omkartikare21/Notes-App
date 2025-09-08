'use client'

import SignupForm from "@/components/SignupForm";
import { useTitle } from "@/utils/customHook";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const strongRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,}$/;
const phone_num = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

const Signup = () => {
  const router = useRouter();
  useTitle("Notes App | Sign Up");

    const handleSignup = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (!strongRegex.test(data.password)) {
            toast.error("Password must be at least 8 characters long and include uppercase, lowercase letters and numbers", { autoClose: 2000 });
            return;
        }

        if(!phone_num.test(data.phone_number)){
            toast.error("Invalid phone number", {autoClose: 2000});
            return;
        }

        if(data.password !== data.confirm_password){
            toast.error("Passwords do not match", {autoClose: 2000});
            return;
        }

        try {
            const response = await axios.post('/api/auth/signup', formData,{
                headers:{'Content-Type': 'multipart/form-data'}
            }).then(toast.success("Creating Account... Redirecting Shortly")).then(
                localStorage.setItem('justLoggedIn', '1') // to show only when he log's in and not on subsequent visit to dashboard page
            )
            setToken(response.data.token);
            setTimeout(() => {
            window.location.href = "/dashboard"
            }, 1500);
        } catch (error) {
            console.log("USER ERROR", error)
            toast.error(error.response?.data?.message || "User Already Exists", { autoClose: 1500 });
        }
    };

    const setToken = (token) => {
    Cookies.set('token', token);
  };

    return (
        <>
        <SignupForm handleSign={handleSignup} />
        </>
    );
};

export default Signup;
