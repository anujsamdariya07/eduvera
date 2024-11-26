import React from 'react'
import Header from '../../components/Header'
import ListView from './components/ListView'

const Subscriptions = () => {
  return (
    <div className=''>
      <Header/>
      <div className='p-8 flex flex-col gap-5'>
        <h1 className='text-3xl font-semibold'>My Subscriptions</h1>
        <ListView/>
      </div>
    </div>
  )
}

export default Subscriptions