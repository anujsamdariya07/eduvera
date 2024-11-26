'use client'

import { Progress } from '@nextui-org/react'
import { useAuth } from 'context/AuthContext'
import { useChapter } from 'lib/courses/chapters/read'
import { useCourse } from 'lib/courses/read'
import { useSubscription } from 'lib/subscriptions/read'
import { Gem, LanguagesIcon, TrendingUp } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

const CurrentChapter = () => {
  const searchParams = useSearchParams()
  const { courseId } = useParams()

  const chapterId = searchParams.get('chapterId')

  // Fetching chapter details
  const { data: chapter } = useChapter({ courseId: courseId, chapterId: chapterId })

  // console.log(chapter?.youtubeId)

  return (
    <div className='p-5 flex-1 flex-col gap-4 w-full bg-white border rounded-xl'>
      {!chapterId && (
        <div>
          <CourseDetails courseId={courseId}/>
        </div>
      )}

      {chapter?.fileType === 'youtube' && (
        <div className='w-full aspect-video'>
          <iframe
            src={`https://www.youtube.com/embed/${chapter?.youtubeVideoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className='w-full h-full rounded-lg'
          ></iframe>
        </div>
      )}
      {chapter?.fileType === 'image' && (
        <img
          className='w-full rounded-lg'
          src={chapter?.fileURL}
          alt=""
        />
      )}
      {chapter?.fileType === 'video' && (
        <div>
          <video
            className='w-full rounded-lg'
            src={chapter?.fileURL}
            controls
          ></video>
        </div>
      )}
      <h1 className='font-semibold text-xl'>
        {chapter?.title}
      </h1>
      <div className='prose' dangerouslySetInnerHTML={{ __html: chapter?.content }}></div>
    </div>
  )
}

const CourseDetails = ({ courseId }) => {
  const { data: course } = useCourse({ id: courseId })

  let user = useAuth()
  user = user.user
  
  const {data: subscription} = useSubscription({id: courseId, uid: user?.uid})
  
  console.log(subscription)
  const percentage = subscription?.totalChapter === 0
  ? 0 
  : (subscription?.completedChapters?.length / subscription?.totalChapter) * 100
  console.log(percentage)
  
  return (
    <div className='flex-1 flex flex-col gap-3 w-full'>
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
      <Progress value={percentage} className="max-w-md" />
      <div className='prose' dangerouslySetInnerHTML={{ __html: course?.description }}></div>
    </div>
  )
}

export default CurrentChapter