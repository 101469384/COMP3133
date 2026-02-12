let onlineUsers = [];

export function registerSocket(io) {
    io.on("connection", (socket) => {
        // send current list on connect
        socket.emit("users:update", onlineUsers);

        socket.on("user:join", (username) => {
            if (!username) return;

            socket.username = username;

            if (!onlineUsers.includes(username)) {
                onlineUsers.push(username);
            }

            io.emit("users:update", onlineUsers);
        });

        socket.on("private:message", (msg) => {
            // expect: { to, from, text }
            io.emit("private:message", msg);
        });

        socket.on("room:message", (msg) => {
            io.emit("room:message", msg);
        });

        socket.on("disconnect", () => {
            if (socket.username) {
                onlineUsers = onlineUsers.filter((u) => u !== socket.username);
                io.emit("users:update", onlineUsers);
            }
        });
    });
}







