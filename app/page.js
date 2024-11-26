import { Search } from 'lucide-react';
import Header from './components/Header';
import CourseGridView from './components/CoursesGridView'

export default function Home() {
  return (
    <main>
      <Header />
      <section className="bg-[url('/search-banner.jpeg')] bg-fixed bg-cover bg-no-repeat bg-top h-[650px] w-full">
        <div className='flex flex-col justify-center items-center gap-3 w-full h-full bg-black bg-opacity-35'>
          <h1 className='text-white text-xl font-bold text-center'>
            All the skills you need in one place!
          </h1>
          <div className='relative'>
            <Search className='absolute top-3 left-4 text-gray-500' />
            <input
              type='text'
              placeholder='Search any course'
              className='text-lg rounded-full px-6 py-2 pl-12 bg-white border shadow-lg focus:outline-none w-full md:w-[80%]'
            />
          </div>
        </div>
      </section>
      <CourseGridView />
    </main>
  );
}
