'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useCourse } from '../../../../../lib/courses/read'
import { useChapters } from '../../../../../lib/courses/chapters/read'
import { Button } from '@nextui-org/react'
import { Edit2, Image, Play, Trash2, Video, Youtube } from 'lucide-react'
import { deleteChapter } from '../../../../../lib/courses/chapters/write'
import { toast } from 'react-hot-toast'

const Chapters = () => {
  const { courseId } = useParams()

  const { data: chapters, error, isLoading } = useChapters({ courseId: courseId })

  return (
    <section className='md:w-[450px] flex flex-col gap-3 w-full p-5 rounded-xl border bg-white'>
      <div className='flex items-center justify-between'>
        <h1 className='text-center text-xl font-semibold'>Chapters</h1>
        <Link href={`/my-courses/${courseId}/chapter-form`}>
          <button className='bg-indigo-800 text-white text-sm px-4 py-1.5 rounded-lg'>Create</button>
        </Link>
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
      await deleteChapter({courseId: chapter?.courseId, chapterId: chapter?.id})
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
      <div className='flex items-center gap-2'>
        <Button
          onClick={() => {
            router.push(`/my-courses/${chapter?.courseId}/chapter-form?id=${chapter?.id}`)
          }}
          size='sm'
          isIconOnly
        >
          <Edit2 size={13} />
        </Button>
        <Button 
          size='sm' 
          color='danger'
          isIconOnly 
          isLoading={isLoading}
          isDisabled={isLoading}
          onClick={handleDelete}
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  )
}

export default Chapters