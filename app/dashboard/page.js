"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Displaycard } from "@/components/Displaycard";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTitle } from "@/utils/customHook";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const router = useRouter();
  useTitle("Notes App | Dashboard");

  // const [location, setLocation] = useState({
  //   latitude: null,
  //   longitude: null
  // });
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchNotes = async () => {
      let response;
      try {
        if (status === "authenticated") {
          response = await axios.get("/api/notes", {
            withCredentials: true,
          });
        } else {
          response = await axios.get("/api/notes", {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
        }
        setNotes(response.data.data);

        if (response.status === 401 || response.status === 403) {
          toast.error("Unauthorized access", { autoClose: 1500 });
          Cookies.remove("token");
          setTimeout(() => router.push("/login"), 1500);
          return;
        }

        if (
          typeof window !== "undefined" &&
          localStorage.getItem("justLoggedIn")
        ) {
          // toast.success(`Welcome! ${ response.data.user.length !== 0 ? response.data?.user : response.data?.data[0]?.author?.name}`, { autoClose: 1500 }); //This is working.
          toast.success(`Welcome! ${response.data?.user}`, { autoClose: 1500 });
          localStorage.removeItem("justLoggedIn"); // this works! only trigger's when logged in 1 time.
        }
      } catch (error) {
        // console.log("THIS IS THE ERRORRRRR", error);
        toast.error(error?.response?.data?.message || "Error fetching notes", {
          autoClose: 1500,
        });
        Cookies.remove("token");
        setTimeout(() => router.push("/login"), 1500);
      }
    };

    fetchNotes();
  }, [router, status]);

  // useEffect(() => {
  //     if (typeof window !== 'undefined' && 'geolocation' in navigator) {
  //       navigator.geolocation.getCurrentPosition(position=>{
  //         const { latitude, longitude } = position.coords;
  //         setLocation({ latitude, longitude });
  //         console.log("INNNN", latitude, longitude);
  //         // --> here axios route with patch/put to update location.
  //       },
  //       (error) => {
  //         console.log('error in geo location', error);
  //       },{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  //     );
  //     }
  // }, [])

  return (
    <>
      {notes && notes.length === 0 ? (
        <p>No notes found...😕</p>
      ) : (
        <Displaycard data={notes} />
      )}
    </>
  );
};

export default Dashboard;
