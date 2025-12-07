import React, { useState, useEffect } from 'react'
import Title from '../../component/Title'
import { assets } from '../../assets/assets'
import { bookingAPI } from '../../services/api'

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        bookings: []
    });
    const [loading, setLoading] = useState(true);
    const [updatingPayment, setUpdatingPayment] = useState(null);
    const [cancellingBooking, setCancellingBooking] = useState(null);
    const [confirmingBooking, setConfirmingBooking] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await bookingAPI.getOwnerBookings();
            const bookings = response.data.data;

            // Calculate totals
            const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

            setDashboardData({
                totalBookings: bookings.length,
                totalRevenue: totalRevenue,
                bookings: bookings
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (bookingId) => {
        if (window.confirm('Mark this booking as paid?')) {
            setUpdatingPayment(bookingId);
            try {
                const response = await bookingAPI.markAsPaid(bookingId);
                if (response.data.success) {
                    alert('Payment status updated successfully!');
                    fetchDashboardData();
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to update payment status.');
            } finally {
                setUpdatingPayment(null);
            }
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            setCancellingBooking(bookingId);
            try {
                const response = await bookingAPI.ownerCancelBooking(bookingId);
                if (response.data.success) {
                    alert('Booking cancelled successfully!');
                    fetchDashboardData();
                    setSelectedBooking(null);
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to cancel booking.');
            } finally {
                setCancellingBooking(null);
            }
        }
    };

    const handleConfirmBooking = async (bookingId) => {
        if (window.confirm('Confirm this booking?')) {
            setConfirmingBooking(bookingId);
            try {
                const response = await bookingAPI.ownerConfirmBooking(bookingId);
                if (response.data.success) {
                    alert('Booking confirmed successfully!');
                    fetchDashboardData();
                    setSelectedBooking(null);
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to confirm booking.');
            } finally {
                setConfirmingBooking(null);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
    }

    return (
        <div>
            <Title align='left' font='outfit' tittle='Dashboard' subTittle='Monitor your room listings, track booking and analyze revenue-all in one place. stay updated with real-time insights to ensure smooth operations.' />
            <div className='flex gap-4 my-8'>
                {/*Total Booking */}
                <div className='bg-primary/5 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10 rounded-full' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Booking</p>
                        <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                    </div>
                </div>

                {/*Total Revenue */}
                <div className='bg-primary/5 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10 rounded-full' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Revenue</p>
                        <p className='text-neutral-400 text-base'>$ {dashboardData.totalRevenue}</p>
                    </div>
                </div>
            </div>
            {/* Recent Booking */}
            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

            <div className='w-full text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll overflow-x-auto'>
                <table className='w-full min-w-max'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Status</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData.bookings.length > 0 ? (
                            dashboardData.bookings.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => setSelectedBooking(item)}
                                    className='cursor-pointer hover:bg-gray-50 transition-colors'
                                >
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        {item.userId?.name || 'Unknown User'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                        {item.roomId?.roomType || 'Unknown Room'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                        $ {item.totalPrice}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                        <div className='flex flex-col items-center gap-2'>
                                            <span className={`py-1 px-3 text-xs rounded-full ${item.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {item.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                            {item.paymentStatus === 'pending' && item.status !== 'cancelled' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsPaid(item._id);
                                                    }}
                                                    disabled={updatingPayment === item._id}
                                                    className='px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                                >
                                                    {updatingPayment === item._id ? 'Updating...' : 'Mark as Paid'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className='py-3 px-4 border-t border-gray-300 text-center'>
                                        <span className={`py-1 px-3 text-xs rounded-full ${item.status === 'confirmed' ? 'bg-green-200 text-green-600' :
                                                item.status === 'cancelled' ? 'bg-red-200 text-red-600' :
                                                    'bg-amber-200 text-yellow-600'
                                            }`}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4 border-t border-gray-300 text-center' onClick={(e) => e.stopPropagation()}>
                                        <div className='flex gap-2 justify-center'>
                                            {item.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleConfirmBooking(item._id)}
                                                        disabled={confirmingBooking === item._id}
                                                        className='px-3 py-1 text-xs bg-green-500 text-white rounded-full hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                                    >
                                                        {confirmingBooking === item._id ? 'Confirming...' : 'Confirm'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelBooking(item._id)}
                                                        disabled={cancellingBooking === item._id}
                                                        className='px-3 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                                    >
                                                        {cancellingBooking === item._id ? 'Cancelling...' : 'Cancel'}
                                                    </button>
                                                </>
                                            )}
                                            {item.status === 'confirmed' && (
                                                <span className='text-xs text-gray-500'>Confirmed</span>
                                            )}
                                            {item.status === 'cancelled' && (
                                                <span className='text-xs text-gray-500'>Cancelled</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-4 text-center text-gray-500">No bookings found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Guest Information */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Guest Information</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <p><span className="font-medium">Name:</span> {selectedBooking.userId?.name || 'N/A'}</p>
                                        <p><span className="font-medium">Email:</span> {selectedBooking.userId?.email || 'N/A'}</p>
                                        <p><span className="font-medium">Guests:</span> {selectedBooking.numberOfGuests}</p>
                                    </div>
                                </div>

                                {/* Room Information */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Room Information</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <p><span className="font-medium">Hotel:</span> {selectedBooking.roomId?.hotelName || 'N/A'}</p>
                                        <p><span className="font-medium">Room Type:</span> {selectedBooking.roomId?.roomType || 'N/A'}</p>
                                        <p><span className="font-medium">City:</span> {selectedBooking.roomId?.city || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Booking Details</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <p><span className="font-medium">Check-in:</span> {formatDate(selectedBooking.checkInDate)}</p>
                                        <p><span className="font-medium">Check-out:</span> {formatDate(selectedBooking.checkOutDate)}</p>
                                        <p><span className="font-medium">Total Amount:</span> ${selectedBooking.totalPrice}</p>
                                        <p><span className="font-medium">Booking ID:</span> {selectedBooking._id.slice(-8)}</p>
                                        <p>
                                            <span className="font-medium">Status:</span>
                                            <span className={`ml-2 py-1 px-3 text-xs rounded-full ${selectedBooking.status === 'confirmed' ? 'bg-green-200 text-green-600' :
                                                    selectedBooking.status === 'cancelled' ? 'bg-red-200 text-red-600' :
                                                        'bg-amber-200 text-yellow-600'
                                                }`}>
                                                {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="font-medium">Payment:</span>
                                            <span className={`ml-2 py-1 px-3 text-xs rounded-full ${selectedBooking.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {selectedBooking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {selectedBooking.status === 'pending' && (
                                    <div className="flex gap-3 justify-end pt-4">
                                        <button
                                            onClick={() => handleConfirmBooking(selectedBooking._id)}
                                            disabled={confirmingBooking === selectedBooking._id}
                                            className='px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            {confirmingBooking === selectedBooking._id ? 'Confirming...' : 'Confirm Booking'}
                                        </button>
                                        <button
                                            onClick={() => handleCancelBooking(selectedBooking._id)}
                                            disabled={cancellingBooking === selectedBooking._id}
                                            className='px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            {cancellingBooking === selectedBooking._id ? 'Cancelling...' : 'Cancel Booking'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard