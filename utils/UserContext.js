"use client"; // if using Next.js app dir and this is client component
import Cookies from "js-cookie";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = Cookies.get("token"); // or wherever you store JWT
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setUser(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (data.success) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
