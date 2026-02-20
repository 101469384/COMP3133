const jwt = require("jsonwebtoken");

function signToken(user) {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
}

function getUserFromReq(req) {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) return null;
    const token = header.replace("Bearer ", "");
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

module.exports = { signToken, getUserFromReq };
