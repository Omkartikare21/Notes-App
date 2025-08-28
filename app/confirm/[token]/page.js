'use client'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
import { setToken } from '@/middlewares/generateToken'
import { toast } from 'react-toastify'
import VerifyEmail from '@/components/VerifyEmail'

const ConfirmEmail = () => {
  const { token } = useParams()
  const router = useRouter()

  const handleVerify = async () => {
    // Call the API to verify the email
    await axios.post(`/api/auth/onboarding/${token}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.data.user.name) {
          toast.success('Email verified successfully!');
          setToken(response.data.access_token);
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          toast.error('Email verification failed.');
        }
      })
      .catch((error) => {
        console.error('Error verifying email:', error);
      });
  }

  return (
    <>
    <VerifyEmail handleVerify={handleVerify} />
    </>
  )
}

export default ConfirmEmail