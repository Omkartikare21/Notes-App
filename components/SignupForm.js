'use client'
import React from 'react'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const SignupForm = ({handleSign}) => {

  return (
    <section className={styles.noteCard} >
    <form onSubmit={handleSign}>
            <input className={styles.inputField} type="text" name="name" placeholder="Name" required />
            <input className={styles.inputField} type="email" name="email" placeholder="Email" required />
            <input className={styles.inputField} type="password" name="password" placeholder="Password" required />
            <input className={styles.inputField} type="text" name="confirm_password" placeholder="Confirm Password" required />
            <input className={styles.inputField} type="text" name="phone_number" placeholder="Phone Number" required />
            <button type="submit">Sign Up</button>
        </form>
        <p className={styles.description} style={{ color: 'black' }}>{`Don't have an account?`} <Link href="/login" style={{ color: '#e243ba', textDecoration: 'underline' }} >Log in</Link> </p>
    </section>
  )
}

export default SignupForm;