'use client'

import AuthContextProvider, { useAuth } from '@/context/AuthContext'
import { Button, CircularProgress } from '@nextui-org/react'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <AuthContextProvider>
      <CheckUser>
        {children}
      </CheckUser>
    </AuthContextProvider>
  )
}

const CheckUser = ({ children }) => {
  const { user, handleSignInWithGoogle, isLoading } = useAuth()
  if (user === undefined) {
    // At the start when the user is undefined, the useEffect in AuthCOntext will set it to null, before setting it we will display this loading icon
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
        <CircularProgress />
      </div>
    )
  }

  if (!user) {
    // After tje user has been set to null, we can display this message
    return (
      <div className='flex flex-col gap-2 h-screen w-screen justify-center items-center'>
        <h1>Please Login First!</h1>
        <Button
        onClick={handleSignInWithGoogle}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Sign In
      </Button>
      </div>
    )
  }

  return <>{children}</>
}

export default Layout