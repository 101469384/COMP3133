import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    password: { type: String, required: true }, // hashed
    creation: { type: String, default: () => new Date().toLocaleString() }
});

export default mongoose.model("User", userSchema);
