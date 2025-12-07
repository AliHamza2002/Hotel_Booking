import React from 'react'
import Navbar from './component/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './component/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetail from './pages/RoomDetail';
import MyBookings from './pages/MyBookings';
import HotelReg from './component/HotelReg';
import Layout from './pages/HotelOwner/Layout';
import Dashboard from './pages/HotelOwner/Dashboard';
import AddRoom from './pages/HotelOwner/AddRoom';
import EditRoom from './pages/HotelOwner/EditRoom';
import ListRoom from './pages/HotelOwner/ListRoom';
import Experience from './pages/Experience';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './component/ProtectedRoute';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const isAuthPath = useLocation().pathname.includes("login") || useLocation().pathname.includes("register");

  return (
    <div>
      {!isOwnerPath && !isAuthPath && <Navbar />}
      {false && <HotelReg />}

      <main className='flex-1'> {/* Changed from div to main, removed padding */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path="/experience" element={<Experience />} />
          <Route path='/room/:id' element={<RoomDetail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/my-bookings' element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/owner' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='edit-room/:id' element={<EditRoom />} />
            <Route path='list-room' element={<ListRoom />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App