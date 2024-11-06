'use client'

import { Button } from '@nextui-org/react'
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { createNewCourses } from '@/lib/courses/write';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: ["extra-small", "small", "medium", "large"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  },
};

const categoriesList = [
  "Development",
  "Business",
  "Finance & Accounting",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Lifestyle",
  "Photography & Video",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
];

const languagesList = [
  "English",
  "Spanish",
  "Mandarin",
  "Hindi",
  "Arabic",
  "Portuguese",
  "French",
  "Russian",
  "German",
  "Japanese",
  "Vietnamese",
  "Afrikaans",
  "Zulu",
];

const levelList = [
  'Beginner',
  'Intermediate',
  'Advance',
]

const Form = () => {
  const [data, setData] = useState({
    title: '',
    shortDescription: '',
    price: 0,
    salePrice: 0,
    category: '',
    language: '',
    level: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()
  
  const { user } = useAuth()

  const handleImage = (e) => {
    if (e.target.files?.length > 0) {
      setImage(e.target.files[0])
    }
  }

  const handleData = (key, value) => {
    setData(prevData => {
      return {
        ...prevData,
        [key]: value,
      }
    })
  }

  const handleSubmit = async () => {
    console.log('Clicked!')
    
    setIsLoading(true)
    try {
      // TODO: Set data to firestore
      await createNewCourses({
        data: data,
        image: image,
        instructorName: user?.displayName,
        instructorEmail: user?.email,
        instructorId: user?.uid,
        instructorPhotoURL: user?.photoURL,
      })
      toast.success('Course has been created successfully!')

      router.push(`/my-courses`)
    } catch (error) {
      toast.error(error?.message)
    }
    setIsLoading(false)
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit()
    }} className='p-8 flex flex-col gap-3 bg-gray-50 min-h-screen w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl'>Create New Courses</h1>
        <Button type='submit' isLoading={isLoading} isDisabled={isLoading}>
          Create
        </Button>
      </div>
      <div className='flex flex-col gap-4 border bg-white p-5 rounded-lg'>
        <input 
          type="text"
          value={data?.title} 
          onChange={(e) => handleData('title', e.target.value)}
          className='w-full border rounded-lg px-4 py-3 text-xl focus:outline-indigo-800' 
          placeholder='Enter Course Title' 
          required
        />
        <div className='w-full border-2 border-dashed rounded-lg p-6'>
          <input type="file" onChange={handleImage} name="" id="" required />
        </div>
        <div className='flex flex-col gap-1'>
          <label 
            className='text-sm text-gray-600' 
            htmlFor="course-short-description"
          >
            Short Description
          </label>
          <input 
            type="text" 
            value={data?.shortDescription} 
          onChange={(e) => handleData('shortDescription', e.target.value)}
            className='border px-5 py-3 rounded-lg w-full' 
            placeholder='Enter Short Description' 
            required
          />
        </div>
        <div className='flex gap-3'>
          <div className='flex flex-col gap-1 w-full'>
            <label
              className='text-sm text-gray-600'
              htmlFor="course-price"
            >
              Price
            </label>
            <input
              type="number"
              value={data?.price}
              onChange={(e) => handleData('price', parseFloat(e.target.value) || 0)}
              className='border px-5 py-3 rounded-lg w-full'
              placeholder='Enter Course Price'
              required
            />
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label
              className='text-sm text-gray-600'
              htmlFor="course-sale-price"
            >
              Sale Price
            </label>
            <input
              type="number"
              value={data?.salePrice}
              onChange={(e) => handleData('salePrice', parseFloat(e.target.value) || 0)}
              className='border px-5 py-3 rounded-lg w-full'
              placeholder='Enter Sale Price'
              required
            />
          </div>
        </div>
        <div className='flex gap-3 w-full'>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="select-category">Category</label>
            <select 
              name="select-category" 
              id="select-category" 
              className='border px-5 py-3 rounded-lg w-full'
              required
              value={data?.category} 
              onChange={(e) => handleData('category', e.target.value)}
            >
              <option value="">Select Category</option>
              {categoriesList.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="select-language">Language</label>
            <select 
              name="select-language" 
              id="select-language" 
              className='border px-5 py-3 rounded-lg w-full'
              required
              value={data?.language} 
              onChange={(e) => handleData('language', e.target.value)}
            >
              <option value="">Select Language</option>
              {languagesList.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="select-level">Level</label>
            <select 
              name="select-level" 
              id="select-level" 
              className='border px-5 py-3 rounded-lg w-full'
              required
              value={data?.level} 
              onChange={(e) => handleData('level', e.target.value)}
            >
              <option value="">Select Level</option>
              {levelList.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        <ReactQuill
          value={data?.description}
          onChange={(value) => {
            handleData('description', value)
          }}
          modules={modules}
          placeholder="Enter your description here..."
          required
        />
      </div>
    </form>
  )
}

export default Form