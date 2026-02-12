
export default function auth(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    // token format: demo:<username>
    if (token.startsWith("demo:")) {
        req.user = { username: token.split(":")[1] };
        return next();
    }

    return res.status(401).json({ message: "Unauthorized" });
}

