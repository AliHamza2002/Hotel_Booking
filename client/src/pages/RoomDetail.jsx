import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import { roomAPI, bookingAPI } from '../services/api';
import StarRating from '../component/StarRating';
import { useAuth } from '../context/AuthContext';

const RoomDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking form state
    const [formData, setFormData] = useState({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1
    });

    // Availability state
    const [availabilityResult, setAvailabilityResult] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [bookingInProgress, setBookingInProgress] = useState(false);

    // Messages
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchRoomDetail();
    }, [id])

    const fetchRoomDetail = async () => {
        try {
            const response = await roomAPI.getRoomById(id);
            const roomData = response.data?.data;
            if (roomData) {
                setRoom(roomData);
                setMainImage(roomData.images[0]);
            }
        } catch (error) {
            console.error("Failed to fetch room details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get amenities as array
    const getAmenitiesArray = (amenities) => {
        if (!amenities) return [];
        if (Array.isArray(amenities)) return amenities;
        if (typeof amenities === 'object') {
            return Object.keys(amenities).filter(key => amenities[key]);
        }
        return [];
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear messages when user changes input
        setErrorMessage('');
        setAvailabilityResult(null);
    };

    // Handle availability check
    const handleCheckAvailability = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setErrorMessage('');
        setSuccessMessage('');
        setAvailabilityResult(null);

        // Check authentication
        if (!isAuthenticated) {
            setErrorMessage('Please log in to check availability and book rooms.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return;
        }

        // Validate form
        if (!formData.checkInDate || !formData.checkOutDate || !formData.numberOfGuests) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (formData.numberOfGuests < 1) {
            setErrorMessage('Number of guests must be at least 1');
            return;
        }

        try {
            setCheckingAvailability(true);
            const response = await bookingAPI.checkAvailability({
                roomId: id,
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                numberOfGuests: parseInt(formData.numberOfGuests)
            });

            if (response.data.success && response.data.available) {
                setAvailabilityResult(response.data.data);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to check availability');
        } finally {
            setCheckingAvailability(false);
        }
    };

    // Handle booking confirmation
    const handleConfirmBooking = async () => {
        try {
            setBookingInProgress(true);
            setErrorMessage('');

            const response = await bookingAPI.createBooking({
                roomId: id,
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                numberOfGuests: parseInt(formData.numberOfGuests)
            });

            if (response.data.success) {
                setSuccessMessage('Booking confirmed successfully! Redirecting to your bookings...');
                setAvailabilityResult(null);

                // Redirect to bookings page after 2 seconds
                setTimeout(() => {
                    navigate('/my-bookings');
                }, 2000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setBookingInProgress(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading room details...</div>;
    }

    if (!room) {
        return <div className="flex justify-center items-center h-screen">Room not found</div>;
    }

    const amenitiesArray = getAmenitiesArray(room.amenities);

    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/* Room Detail */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotelName} <span className='font-inter text-sm '>({room.roomType})</span></h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>
            {/*Room Raiting */}
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
            </div>
            {/*Room Address */}
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.city}</span>
            </div>
            {/*Room Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img src={mainImage} alt="room-image" className='w-full h-[400px] md:h-[500px] rounded-xl shadow-lg object-cover' />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full' >
                    {room?.images.length > 1 && room.images.map((image, index) => (
                        <img onClick={() => setMainImage(image)}
                            key={index} src={image} alt="Room-Image"
                            className={`w-full h-32 md:h-40 rounded-xl shadow-md object-cover cursor-pointer ${mainImage == image && 'outline outline-3 outline-orange-500'}`} />
                    ))}
                </div>
            </div>
            {/*Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
                </div>
                {amenitiesArray.length > 0 && (
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {amenitiesArray.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                {facilityIcons[item] && <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />}
                                <p className='text-sm'>{item}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/*Room Highlights */}
            <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>

            {/*CheckIn CheckOut Form */}
            <form onSubmit={handleCheckAvailability} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>

                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                        <input
                            type="date"
                            id='checkInDate'
                            name='checkInDate'
                            value={formData.checkInDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            placeholder='Check-In'
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                            required
                        />
                    </div>

                    <div className='w-px h-14 bg-gray-300/70 max-md:hidden'>
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                        <input
                            type="date"
                            id='checkOutDate'
                            name='checkOutDate'
                            value={formData.checkOutDate}
                            onChange={handleInputChange}
                            min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                            placeholder='Check-Out'
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                            required
                        />
                    </div>

                    <div className='w-px h-14 bg-gray-300/70 max-md:hidden'>
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests</label>
                        <input
                            type="number"
                            id='guests'
                            name='numberOfGuests'
                            value={formData.numberOfGuests}
                            onChange={handleInputChange}
                            min="1"
                            max={room.maxGuests}
                            placeholder='0'
                            className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                            required
                        />
                    </div>


                </div>
                <button
                    type='submit'
                    disabled={checkingAvailability}
                    className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-24 py-3 md:py-4 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {checkingAvailability ? 'Checking...' : 'Check Availability'}
                </button>
            </form>

            {/* Error Message */}
            {errorMessage && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-6 max-w-6xl mx-auto'>
                    <p className='font-medium'>{errorMessage}</p>
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-6 max-w-6xl mx-auto'>
                    <p className='font-medium'>{successMessage}</p>
                </div>
            )}

            {/* Availability Result */}
            {availabilityResult && (
                <div className='bg-green-50 border border-green-200 rounded-xl p-6 mt-6 max-w-6xl mx-auto'>
                    <div className='flex items-center gap-2 mb-4'>
                        <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                        </svg>
                        <h3 className='text-xl font-semibold text-green-800'>Room Available!</h3>
                    </div>

                    <div className='space-y-2 mb-6'>
                        <p className='text-gray-700'>
                            <span className='font-medium'>Room:</span> {availabilityResult.roomName} ({availabilityResult.roomType})
                        </p>
                        <p className='text-gray-700'>
                            <span className='font-medium'>Number of Nights:</span> {availabilityResult.numberOfNights}
                        </p>
                        <p className='text-gray-700'>
                            <span className='font-medium'>Price per Night:</span> ${availabilityResult.pricePerNight}
                        </p>
                        <p className='text-2xl font-bold text-green-800 mt-4'>
                            Total Price: ${availabilityResult.totalPrice}
                        </p>
                    </div>

                    <button
                        onClick={handleConfirmBooking}
                        disabled={bookingInProgress}
                        className='bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white rounded-md px-8 py-3 text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {bookingInProgress ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                </div>
            )}

            {/*Common Specification*/}
            <div className='mt-24 space-y-4'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>

                    </div>
                ))}
            </div>
            <div>
                <p className='max-w-3xl border-y border-gray-300 my-14 py-10 text-gray-500'>{room.hotelDescription || 'Guests will be allocated on the ground floor according to the availability. You get a comfortable apartment that has a true city feeling.'}</p>
            </div>

            {/*Hosted By */}
            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4'>
                    <div className='h-14 w-14 md:h-16 md:w-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600'>
                        {room.hotelName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className='text-lg md:text-xl'>Hosted by {room.hotelName}</p>
                        <div className='flex items-center mt-1'>
                            <StarRating />
                            <p className='ml-2'>200+ reviews</p>
                        </div>
                    </div>
                </div>

                <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>Contact Now</button>

            </div>

        </div>
    )
}

export default RoomDetail