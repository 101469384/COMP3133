const mongoose = require("mongoose");

module.exports = async function connectDB(uri) {
    mongoose.set("strictQuery", true);

    // Fail fast instead of hanging forever
    return mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000, // 8 sec
        connectTimeoutMS: 8000,
    });
};
