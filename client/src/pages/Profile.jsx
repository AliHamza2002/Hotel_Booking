import React, { useState, useEffect } from 'react';
import Title from '../component/Title';
import { userAPI } from '../services/api';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        role: '',
        image: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            if (response.data.success) {
                const userData = response.data.user;
                setProfile(userData);
                setFormData({
                    name: userData.name,
                    phoneNumber: userData.phoneNumber || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            alert('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Name cannot be empty');
            return;
        }

        setUpdating(true);
        try {
            const response = await userAPI.updateProfile(formData);
            if (response.data.success) {
                alert('Profile updated successfully!');
                fetchProfile(); // Refresh profile data
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    }

    return (
        <div className='py-28 md:pb-36 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title
                tittle='My Profile'
                subTittle='View and update your personal information'
                align='left'
            />

            <div className='max-w-2xl mt-8'>
                {/* Profile Info Card */}
                <div className='bg-white border border-gray-300 rounded-lg p-6 mb-6'>
                    <div className='flex items-center gap-4 mb-6'>
                        <img
                            src={profile.image || 'https://via.placeholder.com/150'}
                            alt='Profile'
                            className='w-20 h-20 rounded-full object-cover border-2 border-gray-300'
                        />
                        <div>
                            <h3 className='text-xl font-semibold text-gray-800'>{profile.name}</h3>
                            <p className='text-gray-500'>{profile.email}</p>
                            <span className='inline-block px-3 py-1 mt-1 text-xs rounded-full bg-blue-100 text-blue-600'>
                                {profile.role === 'hotelOwner' ? 'Hotel Owner' : 'Guest'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className='bg-white border border-gray-300 rounded-lg p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Edit Profile</h3>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Name <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Your name'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Email (Read-only)
                            </label>
                            <input
                                type='email'
                                value={profile.email}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed'
                                readOnly
                            />
                            <p className='text-xs text-gray-500 mt-1'>Email cannot be changed</p>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Phone Number
                            </label>
                            <input
                                type='tel'
                                name='phoneNumber'
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Your phone number'
                            />
                        </div>

                        <div className='flex gap-3 pt-4'>
                            <button
                                type='submit'
                                disabled={updating}
                                className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {updating ? 'Updating...' : 'Save Changes'}
                            </button>
                            <button
                                type='button'
                                onClick={() => setFormData({
                                    name: profile.name,
                                    phoneNumber: profile.phoneNumber || ''
                                })}
                                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all'
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
