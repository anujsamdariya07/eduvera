'use client';

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, { useState } from 'react';
import { Image, Play, Youtube } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteChapter } from 'lib/courses/chapters/write';
import { useChapters } from 'lib/courses/chapters/read';
import { useSubscription } from 'lib/subscriptions/read';
import { useAuth } from 'context/AuthContext';
import {
  markChapterAsCompleted,
  markChapterAsIncompleted,
} from '../../../../../lib/subscriptions/write';
import DownloadCertificate from './DownloadCertificate'
import { useCourse } from 'lib/courses/read';

const Chapters = () => {
  const { courseId } = useParams();

  const { data: chapters } = useChapters({ courseId: courseId });

  const {data: course} = useCourse({id: courseId})

  const { user } = useAuth();

  const { data: subscription } = useSubscription({
    id: courseId,
    uid: user?.uid,
  });

  const percentage =
    subscription?.totalChapter === 0
      ? 0
      : (subscription?.completedChapters?.length / subscription?.totalChapter) *
        100;

  return (
    <section className='md:w-[450px] flex flex-col gap-3 w-full p-5 rounded-xl border bg-white'>
      <div className='flex items-center justify-between'>
        <h1 className='text-center text-xl font-semibold'>Chapters</h1>
      </div>
      <div className='flex flex-col gap-3'>
        {chapters?.map((chapter) => {
          return (
            <div key={chapter?.id}>
              <ChapterCard chapter={chapter} totalChapter={chapters?.length} />
            </div>
          );
        })}
      </div>
      {percentage >= 75 ? <DownloadCertificate studentName={user?.displayName} courseName={course?.title} /> : null}
    </section>
  );
};

const ChapterCard = ({ chapter, totalChapter }) => {
  const router = useRouter();
  const pathName = usePathname();

  const searchParams = useSearchParams();

  const currentId = searchParams.get('chapterId');

  const { user } = useAuth();

  const { data: subscription } = useSubscription({
    uid: user?.uid,
    id: chapter?.courseId,
  });

  const isCompleted =
    subscription?.completedChapters?.find((item) => item === chapter?.id) ||
    false;

  const handleChecked = async () => {
    try {
      if (!isCompleted) {
        // Mark as complete
        await markChapterAsCompleted({
          chapterId: chapter?.id,
          courseId: chapter?.courseId,
          totalChapter: totalChapter,
          uid: user?.uid,
        });
      } else {
        // Mark as incomplete
        await markChapterAsIncompleted({
          chapterId: chapter?.id,
          courseId: chapter?.courseId,
          totalChapter: totalChapter,
          uid: user?.uid,
        });
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div
      onClick={() => {
        router.push(`${pathName}?chapterId=${chapter?.id}`);
      }}
      className={`flex justify-between border px-3 py-2 rounded-lg cursor-pointer
      ${
        currentId === chapter?.id
          ? 'border-2 border-indigo-300 bg-indigo-50'
          : ''
      }
    `}
    >
      <div className='flex gap-1 items-center'>
        <input
          onChange={handleChecked}
          type='checkbox'
          checked={isCompleted ? true : false}
        />
        <h1 className='line-clamp-2'>{chapter?.title}</h1>
      </div>
    </div>
  );
};

export default Chapters;
