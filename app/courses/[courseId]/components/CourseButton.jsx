'use client'

import { useAuth } from 'context/AuthContext'
import { Edit2, Play, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { createCheckoutSessionAndGetURL } from '../../../../lib/checkout/create'
import { useSubscription } from '../../../../lib/subscriptions/read'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'

const CourseButton = ({ course }) => {
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleBuyNow = async () => {
    setIsLoading(true)

    try {
      const url = await createCheckoutSessionAndGetURL({
        uid: user?.uid,
        course: course,
      })
      console.log('Clicked!')
      console.log('URL: ', url)

      const reqURL = url?._document?.data?.value?.mapValue?.fields?.url?.stringValue
      // console.log('URL(): ', url())
      if (reqURL && reqURL !== '') {
        router.push(reqURL)
      } else {
        throw new Error('Failed to checkout!')
      }
    } catch (error) {
      console.log('ERROR🙀', error?.message)
      toast.error(error?.message)
    }

    setIsLoading(false)
  }

  const { data } = useSubscription({ uid: user?.uid, id: course?.id })

  if (data) {
    // Already purchased
    return (
      <Link href={`/subscriptions/${course?.id}`}>
        <button className='flex gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm justify-center'>
          <Play size={16} />
          Learn
        </button>
      </Link>
    )
  }

  if (user?.uid === course?.instructorId) {
    return (
      <Link href={`/my-courses/${course?.id}`}>
        <button className='flex gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm justify-center'>
          <Edit2 size={16} />
          Edit
        </button>
      </Link>
    )
  }

  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handleBuyNow}
      href={`/courses/${course?.id}`}
      className='flex gap-2 items-center bg-indigo-600 mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm justify-center'
    >
      <ShoppingBag size={16} />
      Buy Now
    </Button>
  )
}

export default CourseButton