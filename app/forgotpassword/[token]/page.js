'use client'

import { useParams } from 'next/navigation'
import React from 'react'
import ResetPassword from '@/components/ResetPassword'

const ForgotPassword = () => {
  const { token } = useParams()

  return (
    <>
    <ResetPassword token={token} />
    </>
  )
}

export default ForgotPassword