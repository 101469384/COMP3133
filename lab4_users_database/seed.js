const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const User = require("./models/User");

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const filePath = path.join(__dirname, "UsersData.json");
        const raw = fs.readFileSync(filePath, "utf-8");
        const users = JSON.parse(raw);

        await User.deleteMany({});
        await User.insertMany(users);
        console.log(`✅ Inserted ${users.length} users`);
        process.exit(0);
    } catch (e) {
        console.error("❌ Seed error:", e.message);
        process.exit(1);
    }
}

seed();
