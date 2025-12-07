import React, { useState, useEffect } from 'react'
import Title from '../../component/Title'
import { roomAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'

const ListRoom = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await roomAPI.getMyRooms();
            const roomList = response.data?.data || [];
            setRooms(roomList);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAvailabilityToggle = async (roomId, currentStatus) => {
        try {
            const updatedRooms = rooms.map(room =>
                room._id === roomId ? { ...room, isAvailable: !currentStatus } : room
            );
            setRooms(updatedRooms);
            await roomAPI.updateRoom(roomId, { isAvailable: !currentStatus });
        } catch (error) {
            console.error("Failed to update room availability:", error);
            fetchRooms();
            alert("Failed to update status");
        }
    };

    const handleDelete = async (roomId) => {
        if (window.confirm("Are you sure you want to delete this room?")) {
            try {
                await roomAPI.deleteRoom(roomId);
                setRooms(rooms.filter(room => room._id !== roomId));
                alert("Room deleted successfully");
            } catch (error) {
                console.error("Failed to delete room:", error);
                alert("Failed to delete room");
            }
        }
    };

    // Helper function to display amenities
    const displayAmenities = (amenities) => {
        if (!amenities) return 'N/A';
        if (Array.isArray(amenities)) return amenities.join(', ');
        if (typeof amenities === 'object') {
            return Object.keys(amenities).filter(key => amenities[key]).join(', ') || 'None';
        }
        return 'N/A';
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading rooms...</div>;
    }

    return (
        <div>
            <Title align='left' font='outfit' tittle='Room Listing' subTittle='View, edit or manage all the listed rooms. Keep the information up-to-date to provide the best experience for the users.' />
            <p className='text-gray-500 mt-8'>All Rooms</p>
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                            <th className='py-3 px-4 text-gray-800 font-medium '>Price / night</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Availability</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {rooms && rooms.length > 0 ? (
                            rooms.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        {item.roomType}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                        {displayAmenities(item.amenities)}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        $ {item.pricePerNight}
                                    </td>
                                    <td className='py-3 px-4 border-t border-gray-300 text-sm text-center'>
                                        <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3' >
                                            <input
                                                type="checkbox"
                                                className='sr-only peer'
                                                checked={item.isAvailable}
                                                onChange={() => handleAvailabilityToggle(item._id, item.isAvailable)}
                                            />
                                            <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200'>
                                            </div>
                                            <span className='absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5'>
                                            </span>
                                        </label>
                                    </td>
                                    <td className='py-3 px-4 border-t border-gray-300 text-sm text-center'>
                                        <div className='flex items-center justify-center gap-2'>
                                            <button
                                                onClick={() => navigate(`/owner/edit-room/${item._id}`)}
                                                className='text-blue-600 hover:text-blue-800 font-medium'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className='text-red-600 hover:text-red-800 font-medium'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500">No rooms listed yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ListRoom