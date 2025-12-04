import React, { useState, useEffect } from 'react'
import Title from '../component/Title'
import { assets } from '../assets/assets'
import { bookingAPI } from '../services/api'

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    if (window.confirm('Proceed with payment?')) {
      setProcessingPayment(bookingId);
      try {
        const response = await bookingAPI.makePayment(bookingId);
        if (response.data.success) {
          alert('Payment successful!');
          fetchBookings(); // Refresh bookings
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Payment failed. Please try again.');
      } finally {
        setProcessingPayment(null);
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setCancellingBooking(bookingId);
      try {
        const response = await bookingAPI.cancelBooking(bookingId);
        if (response.data.success) {
          alert('Booking cancelled successfully!');
          fetchBookings(); // Refresh bookings
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Cancellation failed. Please try again.');
      } finally {
        setCancellingBooking(null);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading bookings...</div>;
  }

  return (
    <div className='py-28 md:pb-36 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>

      <Title
        tittle='My Bookings'
        subTittle='Easily manage past, current and upcoming hotel reservation in one place. Plan your trips seamlessly with just a few clicks'
        align='left'
      />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>

        <div className='hidden md:grid md:[grid-template-columns:3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div>Hotels</div>
          <div>Date & Time</div>
          <div>Payment</div>
        </div>

        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className='grid grid-cols-1 md:[grid-template-columns:3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'
            >
              {/* Hotel Details */}
              <div className='flex flex-col md:flex-row'>
                <img
                  src={booking.roomId?.images[0] || assets.roomImg1}
                  alt='hotel-img'
                  className='w-full md:w-44 rounded shadow object-cover'
                />
                <div className='flex flex-col gap-1.5 max-md:mt-3 md:ml-4'>
                  <p className='font-playfair text-2xl'>
                    {booking.roomId?.hotelName || 'Unknown Hotel'}
                    <span className='font-inter text-sm'> ({booking.roomId?.roomType || 'Unknown Room'})
                    </span>
                  </p>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.locationIcon} alt='location-icon' />
                    <span>{booking.roomId?.city || 'Unknown Location'}</span>
                  </div>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.guestsIcon} alt='guest-icon' />
                    <span>Guests: {booking.numberOfGuests}</span>
                  </div>
                  <p className='text-base'>Total: ${booking.totalPrice}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                <div>
                  <p>Check-In:</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>

              </div>

              {/* Payment Status */}
              <div className='flex flex-col items-start justify-center pt-3 gap-2'>
                <div className='flex items-center gap-2'>
                  <div className={`h-3 w-3 rounded-full ${booking.status === 'cancelled' ? 'bg-gray-500' :
                      booking.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                  </div>
                  <p className={`text-sm ${booking.status === 'cancelled' ? 'text-gray-500' :
                      booking.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {booking.status === 'cancelled' ? 'Cancelled' :
                      booking.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </p>
                </div>

                <div className='flex gap-2'>
                  {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handlePayment(booking._id)}
                      disabled={processingPayment === booking._id}
                      className='px-4 py-1.5 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {processingPayment === booking._id ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingBooking === booking._id}
                      className='px-4 py-1.5 text-xs border border-red-400 text-red-600 rounded-full hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {cancellingBooking === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
