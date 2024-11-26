'use client'

import { Button, Progress } from '@nextui-org/react'
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { File, Image, Play, SquarePlay, Video, VideoIcon, VideotapeIcon, Youtube, YoutubeIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { createNewChapter, updateChapter } from '../../../../../lib/courses/chapters/write';
import { getChapters } from '../../../../../lib/courses/chapters/read_server';

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

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const ChapterForm = () => {
  const [fileType, setFileType] = useState(null)
  const [data, setData] = useState({
    title: '',
    youtubeVideoId: '',
    content: '',
  })
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingProgress, setUploadingProgress] = useState(0)

  const router = useRouter()

  const { courseId } = useParams()

  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  // Get data from chapter id
  const fetchData = async () => {
    try {
      const chapter = await getChapters({courseId: courseId, chapterId: id})
      if (!chapter) {
        throw new Error('Chapter not found')
      }
      setData(chapter)
      setFileType(chapter?.fileType)
    } catch (error) {
      toast.error(error?.message)
    }
  }

  useEffect(() => {
    if (id) {
      // Fetch data if id present
      fetchData()
    }
  }, [id])
  
  const handleData = (key, value) => {
    setData((prevData) => (
      {
        ...prevData,
        [key]: value,
      }
    ))
  }

  const handleFile = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    
    setIsLoading(true)
    try {
      console.log('isLoading, fileType:', isLoading, fileType)
      
      // TODO: Create chapter in firestore
      await createNewChapter(
        {
          courseId: courseId,
          data: data,
          file: file,
          fileType: fileType,
          progressCallback: (progress) => {
            // We are using callback instead of directly using hook because then, the speed will be too fast to be displayed
            setUploadingProgress((prevUploadingProgress) => {
              console.log('progress', progress)
              return progress
            })
          }
        }
      )
      toast.success('Successfully Created!')
      router.push(`/my-courses/${courseId}`)
    } catch (error) {
      console.log('ERROR HERE...')
      toast.error(error?.message)
    }
    setIsLoading(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    setIsLoading(true)
    try {
      console.log('isLoading, fileType:', isLoading, fileType)
      
      // TODO: Update chapter in firestore
      await updateChapter(
        {
          courseId: courseId,
          data: data,
          file: file,
          fileType: fileType,
          progressCallback: (progress) => {
            // We are using callback instead of directly using hook because then, the speed will be too fast to be displayed
            setUploadingProgress((prevUploadingProgress) => {
              console.log('progress', progress)
              return progress
            })
          }
        }
      )
      toast.success('Successfully Updated!')
      router.push(`/my-courses/${courseId}`)
    } catch (error) {
      console.log('ERROR HERE...')
      toast.error(error?.message)
    }
    setIsLoading(false)
  }
  
  return (
    <form className='p-8 flex flex-col gap-4' onSubmit={(e) => {
      e.preventDefault()
      id ? handleUpdate(e) : handleCreate(e)
    }}>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semi bold text-center mb-5'>
          {
            id ? 'Update Form' : 'Create New Chapter'
          }
        </h1>
        <div className='flex gap-2'>
          <Button 
            isLoading={isLoading}
            isDisabled={isLoading}
            color='primary'
            type='submit'
          >
            {
              id? 'Update': 'Create'
            }
          </Button>
          
          <Button 
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={() => router.push(`/my-courses/${courseId}`)}
            color='secondary'
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="bg-white border p-5 rounded-xl flex flex-col gap-3">
        <input 
          type="text" 
          name="" 
          id="" 
          value={data?.title}
          onChange={(e) => {
            handleData('title', e.target.value)
          }}
          placeholder='Enter Chapter Title' 
          className='px-4 py-2 text-lg border w-full rounded-lg' 
        />
        {isLoading && fileType !== 'youtube' && (
          <div>
            <Progress
              aria-label="Uploading..."
              value={uploadingProgress}
              className="max-w-md"
              color={parseInt(uploadingProgress) === 100 ? 'success' : 'primary'}
            />
          </div>
        )}
        {!fileType && <div className='flex justify-center items-center gap-4 w-full py-5 border-2 border-dashed rounded-xl'>
          <div 
            className='border p-4 rounded-xl cursor-pointer'
            onClick={() => {
              setFileType('youtube')
            }}
          >
            <Youtube size={25} className='text-gray-500' />
          </div>
          <div 
            className='border p-4 rounded-xl cursor-pointer'
            onClick={() => {
              setFileType('image')
            }}
          >
            <Image size={25} className='text-gray-500' />
          </div>
          <div 
            className='border p-4 rounded-xl cursor-pointer'
            onClick={() => {
              setFileType('video')
            }}
          >
            <Play size={25} className='text-gray-500' />
          </div>
        </div>}
        {fileType === 'youtube' && (
          <div className='flex flex-col gap-2'>
            <div className='flex gap-3 items-center'>
              <label className='text-gray-600 text-sm font-medium' htmlFor="youtube-video-id">Youtube Video ID</label>
              <button 
                onClick={
                  () => {
                    setFileType(null)
                    handleData('youtubeVideoId', '')
                  }
                }
                className='text-red-700 text-xs font-semibold bg-red-100 px-2 py-1 rounded-lg'
              >Remove</button>
            </div>
            <input 
              id='youtube-video-id' 
              name='youtube-video-id' 
              type="text" 
              value={data?.youtubeVideoId}
              onChange={(e) => {
                handleData('youtubeVideoId', e.target.value)
              }}
              placeholder='Enter Youtube Video ID'
              className='border px-4 py-2 w-full rounded-lg focus:outline-none' 
            />
          </div>
        )}
        {fileType === 'video' && (
          <div className='flex flex-col gap-2'>
            <div className='flex gap-3 items-center'>
              <label className='text-gray-600 text-sm font-medium' >
                Select Video
              </label>
              <button 
                onClick={
                  () => {
                    setFileType(null)
                    setFile(null)
                  }
                }
                className='text-red-700 text-xs font-semibold bg-red-100 px-2 py-1 rounded-lg'
              >Remove</button>
            </div>
            <input
              type="file" 
              onChange={handleFile}
              className='border px-4 py-2 w-full rounded-lg focus:outline-none' 
            />
          </div>
        )}
        {fileType === 'image' && (
          <div className='flex flex-col gap-2'>
            <div className='flex gap-3 items-center'>
              <label className='text-gray-600 text-sm font-medium'>
                Select Image
              </label>
              <button 
                onClick={
                  () => {
                    setFileType(null)
                    setFile(null)
                  }
                }
                className='text-red-700 text-xs font-semibold bg-red-100 px-2 py-1 rounded-lg'
              >Remove</button>
            </div>
            <input
              type="file" 
              onChange={handleFile}
              className='border px-4 py-2 w-full rounded-lg focus:outline-none' 
            />
          </div>
        )}
        <ReactQuill
          value={data?.content}
          onChange={(value) => {
            handleData('content', value)
          }}
          modules={modules}
          placeholder="Enter your content"
          required
        />
      </div>
    </form>
  )
}

export default ChapterForm