import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['guest', 'hotelOwner'],
        default: 'guest'
    },
    image: { type: String, default: 'https://via.placeholder.com/150' },
    phoneNumber: { type: String },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;