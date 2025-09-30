'use client'
import React from 'react'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export const Displaycard = ({ data }) => {
    const router = useRouter();  

    const handleNoteClick = (id) => {
    router.push(`/${id}`);
    };

  return (
    <>
    <section className={styles.notesSection}>
        {data && data?.map((note) => (
          <article key={note._id} className={styles.card} onClick={() => handleNoteClick(note._id)}>
            <h3>{note.title}</h3>
            <p className={styles.noteBody} dangerouslySetInnerHTML={{__html: note?.description}} />
            <div className={styles.cardFooterRow} >
              {/* <footer className={styles.cardAuthor} >Author: {note?.author.name}</footer> */}
              <footer className={styles.cardDate} >Date: {format(new Date(note.createdAt), 'dd-MM-yyyy')}</footer>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
