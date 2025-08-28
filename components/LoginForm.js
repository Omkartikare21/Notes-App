'use client'
import React from 'react'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const LoginForm = ({handleLogin}) => {

  return (
    <section className={styles.noteCard} >
    <form onSubmit={handleLogin}>
            <input className={styles.inputField} type="text" name="email" placeholder="Email" required />
            <input className={styles.inputField} type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
            <p className={styles.description} style={{ color: 'black' }}>{`Don't have an account?`} <Link href="/signup" style={{ color: '#e243ba', textDecoration: 'underline' }} >Sign Up For Free</Link> </p>
        </form>
    </section>
  )
}

export default LoginForm;