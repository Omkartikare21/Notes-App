"use client";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const router = useRouter()

  // Fetch user profile on mount
  useEffect(() => {
    let response;
    async function fetchUserProfile() {
      try {
        if(status !== 'loading'){
        if (status === "authenticated" && session.user) {
          setUser(session.user);
          setLoading(false);
          return;
        }

        const token = Cookies.get("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok || response.status === 401 ) {
          setUser(null);
          setLoading(false);
          router.push('/login')
          return;
        }
        const data = await response.json();
        
        if (data.success) {
          setUser(data);
        } else {
          setUser(null);
        }
      }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [status, session, router]);
  
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
