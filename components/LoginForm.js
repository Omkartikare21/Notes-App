'use client'
import React, { useState } from 'react'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const LoginForm = ({handleLogin, handleForgotPassword}) => {
  const [forgot, setForgot] = useState(false)

  return (
    <>
    {!forgot ?
    <section className={styles.noteCard} >
    <form onSubmit={handleLogin}>
            <input className={styles.inputField} type="text" name="email" placeholder="Email" required />
            <input className={styles.inputField} type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
            <p className={styles.description} style={{ color: 'black' }}>{`Don't have an account?`} <Link href="/signup" style={{ color: '#e243ba', textDecoration: 'underline' }} >Sign Up For Free</Link> </p>
        </form>
            <button className={styles.btn} onClick={() => setForgot(true)} >Forgot Password</button>
    </section>
    :
    <section className={styles.noteCard} >
    <form onSubmit={handleForgotPassword}>
            <input className={styles.inputField} type="text" name="email" placeholder="Email" required />
            <button type="submit">Submit</button>
            <p className={styles.description} style={{ color: 'black' }}>{`Don't have an account?`} <Link href="/signup" style={{ color: '#e243ba', textDecoration: 'underline' }} >Sign Up For Free</Link> </p>
        </form>
    </section>
}
    </>
  )
}

export default LoginForm;