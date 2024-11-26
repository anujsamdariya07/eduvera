'use client'

// import { useAuth } from '@/context/AuthContext'
import { useCourses } from '../../../../lib/courses/read'
import { deleteCourse } from '../../../../lib/courses/write'
import { Button, CircularProgress } from '@nextui-org/react'
import { Edit2, Play, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../../../context/AuthContext'

const ListView = () => {
  const {user} = useAuth()
  const {data, error, isLoading} = useCourses({ uid: user?.uid })

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
        <CourseCard item={item} key={item?.id} />
      ))}
    </div>
  )
}

const CourseCard = (item, key) => {
  item = item.item

  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  const handleDeleteCourse = async () => {
    if (!confirm('Are you sure?')) {
      return
    }
    
    setIsLoading(true)
    try {
      await deleteCourse({id: item?.id})
      toast.success('Successfully Deleted!')
    } catch (error) {
      toast.error(error?.message)
    }
    setIsLoading(false)
  }

  return (
    <div key={key} className='border rounded-xl'>
      <img 
        className='h-64 rounded-t-lg object-cover object-center w-full' 
        src={item?.imageURL}
        alt="" 
      />
      <div className='p-3'>
      <h1 className='font-semibold line-clamp-2'>
        {item?.title}
      </h1>
      <h1 className='text-gray-600 text-sm'>
        {item?.totalStudents} {item?.totalStudents === 1? 'Student': 'Students'} Enrolled
      </h1>
      <div className='flex gap-4 w-full mt-2'>
        <Button 
          onClick={() => {
            router.push(`/my-courses/${item?.id}`)
          }}
          className='w-full flex gap-1'
        >
          <Play size={13} />
          View
        </Button>
        <Button 
          color='primary' 
          isIconOnly
          onClick={() => {
            router.push(`my-courses/form?id=${item?.id}`)
          }}
        >
          <Edit2 size={13}/>
        </Button>
        <Button 
          isLoading={isLoading}
          isDisabled={isLoading}
          onClick={handleDeleteCourse}
          color='danger' 
          isIconOnly
        >
          <Trash2 size={13}/>
        </Button>
      </div>
      </div>
    </div>
  )
}

/*



*/

export default ListView