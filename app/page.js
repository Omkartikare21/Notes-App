import React from 'react'
import { Displaycard } from '@/components/Displaycard';
import { getNoteMetadata } from '@/utils/getNoteMetaData';

export async function generateMetadata() {
  return await getNoteMetadata("HOME");
}

const Note = async () => {
  const res = await fetch("http://localhost:3000/api/notes");
  const { data } = await res.json();
  return (
    <>
      <main>
      <Displaycard data={data} />
      </main>
    </>
  )
}

export default Note
