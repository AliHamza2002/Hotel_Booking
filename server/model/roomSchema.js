import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
  // Hotel Information
  hotelName: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  
  hotelDescription: {
    type: String,
    required: [true, 'Hotel description is required'],
    trim: true
  },
  
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  
  // Room Details
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite']
  },
  
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Amenities (matches your form exactly)
  amenities: {
    'Free Wifi': { type: Boolean, default: false },
    'Free Breakfast': { type: Boolean, default: false },
    'Room Service': { type: Boolean, default: false },
    'Mountain View': { type: Boolean, default: false },
    'Pool Access': { type: Boolean, default: false }
  },
  
  // Images (URLs)
  images: [{
    type: String
  }],
  
  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Owner Reference
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxGuests: {
  type: Number,
  required: true,
  default: 2  // or based on room type
}
}, { 
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Index for faster queries
roomSchema.index({ city: 1, roomType: 1 });
roomSchema.index({ ownerId: 1 });

const Room = model('Room', roomSchema);

export default Room;

// ============================================
// USAGE EXAMPLES
// ============================================
/*
const Room = require('./models/Room');

// 1. Create a new room
const newRoom = new Room({
  hotelName: 'Grand Plaza Hotel',
  hotelDescription: 'Luxury hotel in the heart of the city with stunning views',
  city: 'New York',
  roomType: 'Luxury Room',
  pricePerNight: 150,
  amenities: {
    'Free Wifi': true,
    'Free Breakfast': true,
    'Room Service': true,
    'Mountain View': false,
    'Pool Access': true
  },
  images: ['image_url_1', 'image_url_2', 'image_url_3', 'image_url_4'],
  ownerId: '507f1f77bcf86cd799439011'
});

await newRoom.save();

// 2. Find all rooms
const allRooms = await Room.find({ isAvailable: true });

// 3. Find rooms by city
const roomsInNY = await Room.find({ city: 'New York' });

// 4. Find rooms by owner
const ownerRooms = await Room.find({ ownerId: '507f1f77bcf86cd799439011' });

// 5. Find rooms with filters (type + price range)
const filteredRooms = await Room.find({
  roomType: 'Luxury Room',
  pricePerNight: { $lte: 200 },
  isAvailable: true
});

// 6. Update room
await Room.findByIdAndUpdate(
  roomId,
  { pricePerNight: 175, isAvailable: false },
  { new: true }
);

// 7. Delete room
await Room.findByIdAndDelete(roomId);

// 8. Count rooms by city
const count = await Room.countDocuments({ city: 'New York' });
*/