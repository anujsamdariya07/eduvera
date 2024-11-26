import React from 'react'

const FailedPage = ({searchParams}) => {
  const {checkout_id} = searchParams
  
  return (
    <div className='p-8'>
      Failed: {checkout_id}
    </div>
  )
}

export default FailedPage