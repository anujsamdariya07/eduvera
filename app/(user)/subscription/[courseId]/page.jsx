'use client'

import React from 'react'
import { useCourse } from '../../../../lib/courses/read'
import Link from 'next/link';
import UserLogin from 'app/components/UserLogin';
import Chapter from './components/Chapters'
import CurrentChapter from './components/CurrentChapter'

const SubscribedCourse = ({ params }) => {
  const [unwrappedParams, setUnwrappedParams] = React.useState(null);

  React.useEffect(() => {
    params.then(resolvedParams => {
      setUnwrappedParams(resolvedParams);
    });
  }, [params]);

  const { courseId } = unwrappedParams || {};


  const { data: course } = useCourse({ id: courseId })

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white py-4 px-3 flex justify-between items-center border-b w-full sticky top-0 z-50'>
        <div className='flex items-center gap-3'>
          <Link href={'/'}>
            <img className='h-10' src="/eduvera-logo.png" alt="" />
          </Link>
          <Link href={`/subscription/${courseId}`}>
            <h1 className='font-semibold text-2xl line-clamp-1 hidden md:block'>
              {course?.title}
            </h1>
          </Link>
        </div>
        <UserLogin />
      </header>
      <div className='flex flex-col-reverse md:flex-row gap-3 p-5'>
        <CurrentChapter />
        <Chapter />
      </div>
    </div>
  )
}

export default SubscribedCourse