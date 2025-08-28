'use client'
import React, { useState } from 'react'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Editcard = ({note}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const router = useRouter();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    // Save the edited note
    const res = await fetch(`http://localhost:3000/api/notes/${note._id}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedNote),
    })
    const result = await res.json();
    setEditedNote(result.data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    // Delete the note
    const res = await fetch(`http://localhost:3000/api/notes/${note._id}`, {
      method: 'DELETE',
      headers:{
        authorization: `Bearer ${Cookies.get('token')}`,
      }
    })
    const result = await res.json();
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <>
    <section className={styles.noteSection1}>
          <article className={styles.card1}>
            <div className={styles.cardBtns} >
            {isEditing && (
              <button className={styles.editNoteBtn} onClick={handleSave}>Save Note</button>
            )}
            {!isEditing && (
              <>
              <button className={styles.editNoteBtn} onClick={handleEdit}>Edit Note</button>
              <button className={styles.deleteNoteBtn} onClick={handleDelete}>Delete Note</button>
              </>
            )}
            </div>
            <h3>{isEditing ? <input type="text" className={styles.inputField} value={editedNote?.title} onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })} /> : editedNote.title}</h3>
            <p>{isEditing ? <textarea className={styles.textAreaField} value={editedNote?.description} onChange={(e) => setEditedNote({ ...editedNote, description: e.target.value })} /> : editedNote.description}</p>
            <div className={styles.cardFooterRow}>
            <footer className={styles.cardAuthor}>Author: {editedNote?.author.name}</footer>
            <footer className={styles.cardDate}>Date: {new Date(editedNote?.createdAt).toISOString().split('T')[0]}</footer>
            </div>
          </article>
        </section>
    </>
  )
}

export default Editcard