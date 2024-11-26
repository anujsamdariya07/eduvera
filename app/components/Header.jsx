import { LibraryBigIcon, TvMinimalPlayIcon } from 'lucide-react'
import React from 'react'
import UserLogin from './UserLogin'
import Link from 'next/link'
import AuthContextProvider from '../../context/AuthContext'

const Header = () => {
  return (
    <div className='sticky top-0 bg-white z-50'>
      <div className='border-b px-8 py-3 flex justify-between'>
        <Link href={'/'}>
          <img
            src="/logo.png"
            alt=""
            className='h-10'
          />
        </Link>
        <div className='flex gap-3 items-center'>
          <Link
            href={'/subscription'}
            className='hidden md:flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold'
          >
            <TvMinimalPlayIcon />
            Subscription
          </Link>
          <Link
            href={'/my-courses'}
            className='hidden md:flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold'
          >
            <LibraryBigIcon />
            My Courses
          </Link>
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