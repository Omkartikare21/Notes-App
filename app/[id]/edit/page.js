'use client'
import React, { useEffect, useState } from 'react'
import Editcard from '@/components/Editcard';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Loading from '@/utils/Loading';

const EditNotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      const res = await fetch(`http://localhost:3000/api/notes/${id}`, { 
        headers: {
          authorization: `Bearer ${Cookies.get('token')}`
        }
       });
      const response = await res.json();
      setNote(response.data);
      setLoading(false);
    }
    fetchNote();
  }, [id]);

  if (loading) return <Loading />;

  if (!note) return <p>Note not found.</p>;
  return (
    <>
    <Editcard note={note} />
    </>
  )
}

export default EditNotePage