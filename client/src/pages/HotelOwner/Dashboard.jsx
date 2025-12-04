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
                    fetchDashboardData(); // Refresh dashboard
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to update payment status.');
            } finally {
                setUpdatingPayment(null);
            }
        }
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

            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>

                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Booking Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData.bookings.length > 0 ? (
                            dashboardData.bookings.map((item, index) => (
                                <tr key={index}>
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
                                                    onClick={() => handleMarkAsPaid(item._id)}
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500">No bookings found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default Dashboard