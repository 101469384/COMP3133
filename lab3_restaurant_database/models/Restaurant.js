import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        cuisine: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
    },
    { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);

