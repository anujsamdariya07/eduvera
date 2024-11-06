import Link from 'next/link'
import React from 'react'

const MyCourses = () => {
  return (
    <div className='p-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl'>My Courses</h1>
        <Link href={'/my-courses/form'}>
          <button className='bg-indigo-800 text-white px-4 py-2 text-sm rounded-lg'>
            Create New Courses
          </button>
        </Link>
      </div>
    </div>
  )
}

export default MyCourses