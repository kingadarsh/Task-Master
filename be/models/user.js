const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true, 
        trim: true,
        match: [/^[a-zA-Z0-9_]{3,20}$/, "Username must be 3-20 characters long and can contain letters, numbers, and underscores."]
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        trim: true,
        lowercase: true, 
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."]
    },
    password: {
        type: String,
        required: true,
    }
});

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;
