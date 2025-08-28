'use client'
import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Card = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [author, setAuthor] = useState(Cookies.get('userId'));

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    else if (name === "description") setDescription(value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const form = { title, description, author};
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrorMsg(errs);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        headers: {
          authorization: `Bearer ${Cookies.get('token')}`,
          // Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create note');
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      setErrorMsg('Failed to create note');
    } finally {
      setIsSubmitting(false);
    }
  }

  const validateForm = (form) => {
    const errors = {};
    if (!form.title || form.title.length < 3) errors.title = 'Title required with atleast 3 characters';
    if (!form.description || form.description.length < 10) errors.description = 'Description required with atleast 10 characters';
    return errors;
  }

  return (
    <section className={styles.noteCard} style={{ position: 'relative' }}>
      <form onSubmit={onSubmit}>
        <input
          className={styles.inputField}
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={handleChange}
        />
        {errorMsg.title && (
          <p className={styles.errorText}>{errorMsg.title}</p>
        )}
        <textarea
          className={styles.textAreaField}
          name="description"
          placeholder="Description"
          value={description}
          onChange={handleChange}
        />
        {errorMsg.description && (
          <p className={styles.errorText}>{errorMsg.description}</p>
        )}
        <button type="submit">Create</button>
      </form>
    </section>
  );
};

export default Card;