import React from 'react'
import { Gem, LanguagesIcon, ShoppingBag, TrendingUp } from 'lucide-react'
import { getCourse } from 'lib/courses/read_server'
import Chapters from './components/Chapters'
import Link from 'next/link'
import { Button } from '@nextui-org/react'
import AuthContextProvider from 'context/AuthContext'
import CourseButton from './components/CourseButton'

const CoursePage = async ({ params }) => {
  const { courseId } = await params

  const course = await getCourse({ id: courseId })

  return (
    <main className='flex flex-col md:flex-row gap-3 p-8 min-h-screen w-full bg-gray-50'>
      <div className='flex-1 flex flex-col gap-3 w-full p-5 rounded-xl border bg-white'>
        <img
          className='w-full rounded-xl'
          src={course?.imageURL}
          alt={course?.title}
        />
        <h1 className='text-4xl font-semibold'>
          {course?.title}
        </h1>
        <p className='text-gray-600 text-sm line-clamp-3'>
          {course?.shortDescription}
        </p>

        <div className='flex justify-between gap-4 font-semibold'>
          <h3 className='flex items-center gap-1 font-semibold'>
            <Gem size={15} />{course?.category}
          </h3>
          <h3 className='flex items-center gap-1 font-semibold'>
            <LanguagesIcon size={15} />{course?.language}
          </h3>
          <h3 className='flex items-center gap-1 font-semibold'>
            <TrendingUp size={15} />{course?.level}
          </h3>
        </div>
        <div className='prose' dangerouslySetInnerHTML={{ __html: course?.description }}></div>
      </div>
      <section className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3 w-full p-5 rounded-xl border bg-white'>
          <div className='flex justify-between items-center'>
            <h3 className='font-semibold'>
              Total:
            </h3>
            <h3 className='text-indigo-900 flex gap-2 items-center'>
              ₹ {course?.salePrice}
              <span className='line-through text-gray-600 text-sm'>
                ₹ {course?.price}
              </span>
            </h3>
          </div>
          <AuthContextProvider>
            <CourseButton 
              course={course}
            />
          </AuthContextProvider>
        </div>
        <Chapters />
      </section>
    </main>
  )
}

export default CoursePage