import mongoose, { Schema } from "mongoose";



// Regex for email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// User Schema
const UserSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [emailRegex, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        required: true
    }
});

// Since Next.js runs on the edge, we have to check whether the DB is connected or not. If it is not connected, then only the connection is created.
const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModel;
