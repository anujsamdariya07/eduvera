'use client'

import { CircularProgress, Progress } from '@nextui-org/react'
import React from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { useSubscriptions } from '../../../../lib/subscriptions/read'
import { useCourse } from '../../../../lib/courses/read'
import Link from 'next/link'
import { Play } from 'lucide-react'

const ListView = () => {
  const { user } = useAuth()
  const { data, error, isLoading } = useSubscriptions({ uid: user?.uid })

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return (
      <div className='text-red-500'>
        {error?.message}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {data?.map((item) => (
        <div key={item?.id}>
          <CourseCard item={item} />
        </div>
      ))}
    </div>
  )
}

const CourseCard = (item) => {
  item = item.item
  const { data: course } = useCourse({ id: item?.id })

  console.log(item)
  console.log(item.completedChapters.length, ' ', item.totalChapter)
  
  const percentage = item?.totalChapter === 0
  ? 0 
  : (item?.completedChapters?.length / item?.totalChapter) * 100
  console.log(percentage)

  return (
    <div className='border rounded-xl'>
      <img
        className='h-64 rounded-t-lg object-cover object-center w-full'
        src={course?.imageURL}
        alt=""
      />
      <div className='p-3 flex flex-col gap-3'>
        <h1 className='font-semibold line-clamp-2'>
          {course?.title}
        </h1>
        <Progress value={percentage} className="max-w-md" />
        <Link href={`/subscription/${course?.id}`}>
          <button className='flex gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm justify-center'>
            <Play size={16} />
            Learn
          </button>
        </Link>
      </div>
    </div>
  )
}

export default ListView