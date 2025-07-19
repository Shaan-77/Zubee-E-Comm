import React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div>
      {/* Header section */}
      <Header />
      {/* Main content goes here */}
      <main>
       <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>

  )
}

export default UserLayout