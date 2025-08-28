'use client'
import LoginForm from "@/components/LoginForm";
import { useTitle } from "@/utils/customHook";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Login = () => {
  const router = useRouter();
  useTitle("Notes App | Login"); // To set title for pages, separate function

    const handleLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await axios.post('/api/auth/login', data);
            setToken(response.data.token);
            router.push("/dashboard");
            localStorage.setItem('justLoggedIn', '1') // to show only when he log's in and not on subsequent visit to dashboard page
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const setToken = (token) => {
    Cookies.set('token', token);
  };

    return (
        <>
        <LoginForm handleLogin={handleLogin} />
       </>
    );
};

export default Login;
