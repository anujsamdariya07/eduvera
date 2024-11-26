'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Image, Play, Youtube } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { deleteChapter } from 'lib/courses/chapters/write'
import { useChapters } from 'lib/courses/chapters/read'

const Chapters = () => {
  const { courseId } = useParams()

  const { data: chapters, error, isLoading } = useChapters({ courseId: courseId })

  return (
    <section className='md:w-[450px] flex flex-col gap-3 w-full p-5 rounded-xl border bg-white'>
      <div className='flex items-center justify-between'>
        <h1 className='text-center text-xl font-semibold'>Chapters</h1>
      </div>
      <div className='flex flex-col gap-3'>
        {chapters?.map((chapter) => {
          return (
            <div key={chapter?.id} >
              <ChapterCard chapter={chapter} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

const ChapterCard = ({ chapter }) => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this chapter?')) {
      return
    }

    setIsLoading(true)

    try {
      await deleteChapter({ courseId: chapter?.courseId, chapterId: chapter?.id })
      toast.success('Successfully Deleted!')
    } catch (error) {
      toast.error(error?.message)
    }

    setIsLoading(false)
  }

  return (
    <div className='flex justify-between border px-3 py-2 rounded-lg'>
      <div className='flex gap-1 items-center'>
        {chapter?.fileType === 'youtube' && <Youtube size={20} />}
        {chapter?.fileType === 'video' && <Play size={20} className='text-gray-500' />}
        {chapter?.fileType === 'image' && <Image size={20} className='text-gray-500' />}
        <h1 className='line-clamp-2'>
          {chapter?.title}
        </h1>
      </div>
    </div>
  )
}

export default Chapters