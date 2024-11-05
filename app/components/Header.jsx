import { LibraryBigIcon, TvMinimalPlayIcon } from 'lucide-react'
import React from 'react'
import UserLogin from './UserLogin'
import AuthContextProvider from '@/context/authContext'

const Header = () => {
  return (
    <div>
      <div className='border-b px-8 py-3 flex justify-between'>
        <img
          src="/logo.png"
          alt=""
          className='h-10'
        />
        <div className='flex gap-3 items-center'>
          <button className='hidden md:flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold'>
            <TvMinimalPlayIcon />
            Subscription
          </button>
          <button className='hidden md:flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold'>
            <LibraryBigIcon />
            My Courses
          </button>
          {/* Since we have used useAuth in UserLogin component */}
          <AuthContextProvider>
            <UserLogin />
          </AuthContextProvider>
        </div>
      </div>
    </div>
  )
}

export default Header