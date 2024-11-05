import { LibraryBigIcon, TvMinimalPlayIcon } from 'lucide-react'
import React from 'react'
import UserLogin from './UserLogin'

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
          <button className='flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold'>
            <TvMinimalPlayIcon />
            Subscription
          </button>
          <button className='flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold'>
            <LibraryBigIcon />
            My Courses
          </button>
          <UserLogin />
        </div>
      </div>
    </div>
  )
}

export default Header