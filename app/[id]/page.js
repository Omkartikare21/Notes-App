'use client'
// app/Notes/[id]/page.js
import Cookies from 'js-cookie';
import EditCard from './edit/page';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTitle } from '@/utils/customHook';

const NotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useTitle(`Notes App | Note`);

  useEffect(() => {
  const fetchNote = async () => {
    const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get('token')}`
      }
    });
    
    const response = await res.json();
    if (res.status === 401 || res.status === 403) {
      toast.error(response.message || 'Unauthorized access', { autoClose: 1500 });
      setIsLoading(false);
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    setNote(response.data);
    setIsLoading(false);
  };  // <--- This closes fetchNote

  fetchNote();
}, [id, router]);

if (isLoading) {
  return <p>Loading...</p>;
}

if (!note) return <p>No note found...😕</p>;


  return (
    <>
    <EditCard note={note} />
    </>
  );
}

export default NotePage;