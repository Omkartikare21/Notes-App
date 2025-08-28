import React from 'react'
import { getNoteMetadata } from '@/utils/getNoteMetaData';
import Card from '@/components/Card';

export async function generateMetadata() {
  return await getNoteMetadata("New");
}

const NewNote = async () => {

  return (
    <>
    <Card />
    </>
  )
}

export default NewNote
