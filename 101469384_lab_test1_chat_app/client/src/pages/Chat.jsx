
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

import RoomChat from "../components/RoomChat";
import PrivateChat from "../components/PrivateChat";


const SOCKET_URL = "http://localhost:5001";

export default function Chat({ user, onLogout }) {
    const [mode, setMode] = useState("room"); // "room" | "private"
    const [onlineUsers, setOnlineUsers] = useState([]);

    const socket = useMemo(() => {
        // create once
        return io(SOCKET_URL, { transports: ["websocket"] });
    }, []);

    useEffect(() => {
        if (!socket || !user?.username) return;

        // tell server who we are
        socket.emit("user:join", user.username);

        const onUsersUpdate = (list) => {
            // list is array of usernames
            const filtered = (Array.isArray(list) ? list : []).filter((u) => u && u !== user.username);
            setOnlineUsers(filtered);
        };

        socket.on("users:update", onUsersUpdate);

        return () => {
            socket.off("users:update", onUsersUpdate);
        };
    }, [socket, user]);

    return (
        <div className="app-container">
            <div className="panel">
                <h1>Chat App</h1>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div>
                        Logged in as: <b>{user?.username}</b>
                    </div>
                    <button onClick={onLogout}>Logout</button>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={() => setMode("room")} disabled={mode === "room"}>
                        Room
                    </button>
                    <button onClick={() => setMode("private")} disabled={mode === "private"}>
                        Private
                    </button>
                </div>

                <div style={{ marginTop: 12 }}>
                    {mode === "room" ? (
                        <RoomChat socket={socket} user={user} />
                    ) : (
                        <PrivateChat socket={socket} user={user} onlineUsers={onlineUsers} />
                    )}
                </div>
            </div>
        </div>
    );
}







