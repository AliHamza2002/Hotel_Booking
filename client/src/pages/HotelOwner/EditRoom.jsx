import React, { useState, useEffect } from 'react'
import Title from '../../component/Title'
import { assets } from '../../assets/assets'
import { uploadAPI, roomAPI } from '../../services/api'
import { useNavigate, useParams } from 'react-router-dom'

const EditRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState({
        1: false, 2: false, 3: false, 4: false
    });

    const [images, setImages] = useState({
        1: null, 2: null, 3: null, 4: null
    })

    // Store actual Cloudinary URLs here
    const [imageUrls, setImageUrls] = useState({
        1: '', 2: '', 3: '', 4: ''
    });

    const [input, setInput] = useState({
        hotelName: '',
        hotelDescription: '',
        city: '',
        roomType: '',
        pricePerNight: 0,
        maxGuests: 2,
        amenities: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false,
        }
    })

    useEffect(() => {
        fetchRoomDetails();
    }, [id]);

    const fetchRoomDetails = async () => {
        try {
            const response = await roomAPI.getRoomById(id);
            const room = response.data.data;

            if (room) {
                // Populate input fields
                const amenitiesObj = {
                    'Free Wifi': false,
                    'Free Breakfast': false,
                    'Room Service': false,
                    'Mountain View': false,
                    'Pool Access': false,
                };

                // Handle amenities if they are an object (which they should be now)
                if (room.amenities && typeof room.amenities === 'object' && !Array.isArray(room.amenities)) {
                    Object.keys(room.amenities).forEach(key => {
                        if (amenitiesObj.hasOwnProperty(key)) {
                            amenitiesObj[key] = room.amenities[key];
                        }
                    });
                }
                // Fallback for legacy array data (though we fixed new ones, old ones might exist)
                else if (Array.isArray(room.amenities)) {
                    room.amenities.forEach(amenity => {
                        if (amenitiesObj.hasOwnProperty(amenity)) {
                            amenitiesObj[amenity] = true;
                        }
                    });
                }

                setInput({
                    hotelName: room.hotelName || '',
                    hotelDescription: room.hotelDescription || '',
                    city: room.city || '',
                    roomType: room.roomType || '',
                    pricePerNight: room.pricePerNight || 0,
                    maxGuests: room.maxGuests || 2,
                    amenities: amenitiesObj
                });

                // Populate images
                const newImageUrls = { 1: '', 2: '', 3: '', 4: '' };
                if (room.images && room.images.length > 0) {
                    room.images.forEach((url, index) => {
                        if (index < 4) {
                            newImageUrls[index + 1] = url;
                        }
                    });
                }
                setImageUrls(newImageUrls);
            }
        } catch (error) {
            console.error("Failed to fetch room details:", error);
            alert("Failed to load room details");
            navigate('/owner/list-room');
        } finally {
            setFetching(false);
        }
    };

    const handleImageUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        setImages({ ...images, [key]: file });

        // Start upload
        setUploading({ ...uploading, [key]: true });

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await uploadAPI.uploadImage(formData);
            setImageUrls({ ...imageUrls, [key]: response.data.url });
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please try again.");
            setImages({ ...images, [key]: null }); // Remove preview on failure
        } finally {
            setUploading({ ...uploading, [key]: false });
        }
    }

    const removeImage = (key) => {
        setImages({ ...images, [key]: null });
        setImageUrls({ ...imageUrls, [key]: '' });
    }

    const handleSubmit = async () => {
        // Validation
        if (!input.hotelName || !input.city || !input.roomType || !input.pricePerNight) {
            alert("Please fill in all required fields");
            return;
        }

        // Collect valid image URLs
        const validImageUrls = Object.values(imageUrls).filter(url => url !== '');
        if (validImageUrls.length === 0) {
            alert("Please upload at least one image");
            return;
        }

        setLoading(true);

        try {
            const roomData = {
                hotelName: input.hotelName,
                hotelDescription: input.hotelDescription,
                city: input.city,
                roomType: input.roomType,
                pricePerNight: Number(input.pricePerNight),
                maxGuests: Number(input.maxGuests),
                amenities: input.amenities,
                images: validImageUrls
            };

            await roomAPI.updateRoom(id, roomData);
            alert("Room updated successfully!");
            navigate('/owner/list-room');
        } catch (error) {
            console.error("Failed to update room:", error);
            alert(error.response?.data?.message || "Failed to update room");
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return <div className="flex justify-center items-center h-64">Loading room details...</div>;
    }

    return (
        <div className='max-w-4xl  pb-20'>
            <div className='space-y-8'>
                <Title align='left' font='outfit' tittle='Edit Room' subTittle='Update room details, pricing and amenities.' />

                {/* Hotel Name & City */}
                <div className='grid sm:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <p className="text-gray-800 font-medium">Hotel Name</p>
                        <input
                            type="text"
                            placeholder="Enter hotel name"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={input.hotelName}
                            onChange={(e) => setInput({ ...input, hotelName: e.target.value })}
                        />
                    </div>
                    <div className='space-y-2'>
                        <p className="text-gray-800 font-medium">City</p>
                        <input
                            type="text"
                            placeholder="Enter city"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={input.city}
                            onChange={(e) => setInput({ ...input, city: e.target.value })}
                        />
                    </div>
                </div>

                {/* Upload Area for images */}
                <div className='space-y-3'>
                    <p className='text-gray-800 font-medium'>Room Images <span className='text-sm font-normal text-gray-500'>(Upload up to 4 images)</span></p>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                        {Object.keys(images).map((key) => (
                            <div key={key} className='relative group'>
                                <label htmlFor={`roomImage${key}`} className='block'>
                                    <div className={`aspect-square rounded-xl border-2 border-dashed ${imageUrls[key] ? 'border-gray-300' : 'border-gray-300 hover:border-blue-500'} cursor-pointer overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all relative`}>
                                        {imageUrls[key] ? (
                                            <>
                                                <img className='w-full h-full object-cover' src={imageUrls[key]} alt={`Room ${key}`} />
                                                {uploading[key] && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                                                <img src={assets.uploadArea} alt="upload" className='w-12 h-12 opacity-60' />
                                                <span className='text-xs mt-2'>Upload</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" accept='image/*' id={`roomImage${key}`} hidden onChange={(e) => handleImageUpload(e, key)} />
                                </label>
                                {imageUrls[key] && !uploading[key] && (
                                    <button
                                        type="button"
                                        onClick={() => removeImage(key)}
                                        className='absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center text-sm'
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hotel Description */}
                <div className='space-y-2'>
                    <p className='text-gray-800 font-medium'>Hotel Description</p>
                    <textarea
                        placeholder='Describe the hotel ambiance, location highlights, and unique features...'
                        className='border border-gray-300 rounded-lg p-3 w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none'
                        value={input.hotelDescription}
                        onChange={(e) => setInput({ ...input, hotelDescription: e.target.value })}
                    />
                </div>

                {/* Room Type & Price */}
                <div className='grid sm:grid-cols-3 gap-6'>
                    <div className='space-y-2'>
                        <p className='text-gray-800 font-medium'>Room Type</p>
                        <select
                            value={input.roomType}
                            onChange={e => setInput({ ...input, roomType: e.target.value })}
                            className='border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer'
                        >
                            <option value="">Select Room Type</option>
                            <option value="Single Bed">Single Bed</option>
                            <option value="Double Bed">Double Bed</option>
                            <option value="Luxury Room">Luxury Room</option>
                            <option value="Family Suite">Family Suite</option>
                        </select>
                    </div>

                    <div className='space-y-2'>
                        <p className='text-gray-800 font-medium'>Price per Night</p>
                        <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
                            <input
                                type="number"
                                placeholder='0'
                                className='border border-gray-300 rounded-lg p-3 pl-8 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                                value={input.pricePerNight}
                                onChange={e => setInput({ ...input, pricePerNight: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <p className='text-gray-800 font-medium'>Max Guests</p>
                        <input
                            type="number"
                            placeholder='2'
                            className='border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                            value={input.maxGuests}
                            onChange={e => setInput({ ...input, maxGuests: e.target.value })}
                        />
                    </div>
                </div>

                {/* Amenities */}
                <div className='space-y-3'>
                    <p className='text-gray-800 font-medium'>Amenities</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4'>
                        {Object.keys(input.amenities).map((amenity, index) => (
                            <label
                                key={index}
                                htmlFor={`amenities${index + 1}`}
                                className='flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-400 transition-all cursor-pointer group'
                            >
                                <input
                                    type="checkbox"
                                    id={`amenities${index + 1}`}
                                    checked={input.amenities[amenity]}
                                    onChange={() => setInput({ ...input, amenities: { ...input.amenities, [amenity]: !input.amenities[amenity] } })}
                                    className='w-5 h-5 cursor-pointer'
                                />
                                <span className='text-gray-700 group-hover:text-gray-900 transition-colors select-none'>{amenity}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex gap-4 pt-4'>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Update Room' : 'Update Room'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/owner/list-room')}
                        disabled={loading}
                        className='border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-all'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditRoom
