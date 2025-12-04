import React from 'react'
import NavBar from '../../component/HotelOwner/NavBar'
import SideBar from '../../component/HotelOwner/SideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col min-h-full'>
        <NavBar/>
        <div className='flex '>
          <SideBar/>
          <div className='flex-1 p-4 pt-10 md:px-10 h-full'>  
            <Outlet/>
          </div>
        </div>

    </div>
  )
}

export default Layout