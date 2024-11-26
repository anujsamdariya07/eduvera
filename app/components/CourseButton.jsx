'use client'

import { Button } from '@nextui-org/react'
import { useAuth } from 'context/AuthContext'
import { Edit2, Play, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useSubscription } from '../../lib/subscriptions/read'

const CourseButton = ({courseId, instructorId}) => {
  const { user } = useAuth()

  const {data} = useSubscription({uid: user?.uid, id: courseId})

  if (data) {
    // Already purchased
    return (
      <Link href={`/subscriptions/${courseId}`}>
        <button className='flex gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm justify-center'>
          <Play size={16} />
          Learn
        </button>
      </Link>
    )
  }

  if (user?.uid === instructorId) {
    return (
      <Link href={`/my-courses/${courseId}`}>
        <button className='flex gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm justify-center'>
          <Edit2 size={16} />
          Edit
        </button>
      </Link>
    )
  }
  
  return (
    <Button className='flex gap-2 items-center bg-indigo-600 mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm justify-center'>
      <ShoppingBag size={16} />
      Buy Now
    </Button>
  )
}

export default CourseButton