import React, { useState, useEffect } from 'react'
import { roomAPI } from '../services/api'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const FeaturedDestination = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getAllRooms()
      const roomList = response.data?.data || []
      setRooms(roomList)
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 bg-slate-50 py-16 md:py-20">
      <Title
        tittle="Featured Destination"
        subTittle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16 w-full max-w-7xl justify-items-center">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">Loading rooms...</div>
        ) : rooms.length > 0 ? (
          rooms.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No rooms available</div>
        )}
      </div>

      {/* Responsive button */}
      <button
        onClick={() => {
          navigate('/rooms')
          window.scrollTo(0, 0)
        }}
        className="mt-12 px-6 py-2.5 text-sm md:text-base font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-all duration-200 cursor-pointer"
      >
        View All Destinations
      </button>
    </div>
  )
}

export default FeaturedDestination





























// import React from 'react'
// import { roomsDummyData } from '../assets/assets'
// import HotelCard from './HotelCard'
// import Tittle from './Title'
// import { Navigate, useNavigate } from 'react-router-dom'

// const FeaturedDestination = () => {
//     const navigate = useNavigate();
//   return (
//     <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
//       <Tittle
//         tittle="Featured Destination"
//         subTittle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
//       />

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 w-full justify-items-center">
//         {roomsDummyData.slice(0, 4).map((room, index) => (
//           <HotelCard key={room._id} room={room} index={index} />
//         ))}
//       </div>
//       <button onClick={()=>{navigate('/rooms'); scrollTo(0,0)}} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
//         View All Destinations
//       </button>
//     </div>
//   )
// }

// export default FeaturedDestination
