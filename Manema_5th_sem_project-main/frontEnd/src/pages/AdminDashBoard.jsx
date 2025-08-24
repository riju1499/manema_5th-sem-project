import React, { useContext } from 'react'
import Header from '../components/AdminPageComp/Header'
import { Outlet } from 'react-router-dom'

const AdminDashBoard = () => {

  return (
    <div className='h-auto w-full bg-theme-dark text-gray-400 overflow-x-hidden'>
        <Header />
        <div className='h-[8vh] w-full'></div>
        <Outlet />
    </div>
  )
}

export default AdminDashBoard
