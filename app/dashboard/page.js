'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import { Displaycard } from '@/components/Displaycard';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useTitle } from '@/utils/customHook';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const router = useRouter();
  useTitle("Notes App | Dashboard"); // To set title for pages, separate function
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/notes',{
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        });
        setNotes(response.data.data);

        if (response.status === 401 || response.status === 403) {
          toast.error("Unauthorized access", { autoClose: 1500 });
          Cookies.remove('token');
          setTimeout(() => router.push('/login'), 1500);
          return;
        }

        if(typeof window !== 'undefined' && localStorage.getItem('justLoggedIn')){
          toast.success(`Welcome! ${response.data?.data[0]?.author?.name}`, { autoClose: 1500 });
          localStorage.removeItem('justLoggedIn'); // this works! only trigger's when logged in 1 time.
        }
        
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error fetching notes", { autoClose: 1500 });
        Cookies.remove('token');
        setTimeout(() => router.push('/login'), 1500);
      }
    };

  fetchNotes()
}, [router]);

  return <Displaycard data={notes} />;
}

export default Dashboard