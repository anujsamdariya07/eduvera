import Header from '@/app/components/Header'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default Layout