
import React, { useEffect, useState } from "react";

export default function RoomChat({ socket, user }) {
    const [room, setRoom] = useState("nodeJS");
    const [joinedRoom, setJoinedRoom] = useState("");
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const onRoomMsg = (msg) => {
            if (!msg) return;
            if (msg.room !== joinedRoom) return;
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("room:message", onRoomMsg);
        return () => socket.off("room:message", onRoomMsg);
    }, [socket, joinedRoom]);

    const join = () => {
        if (!socket) return;
        if (!room) return;

        setMessages([]);
        setJoinedRoom(room);
        socket.emit("room:join", room);
    };

    const leave = () => {
        setJoinedRoom("");
        setMessages([]);
        setText("");
    };

    const send = (e) => {
        e.preventDefault();
        if (!socket) return;
        if (!joinedRoom) return;
        if (!text.trim()) return;

        socket.emit("room:message", {
            room: joinedRoom,
            from: user.username,
            text: text.trim(),
            at: Date.now(),
        });

        setText("");
    };

    return (
        <div>
            <h3>Rooms</h3>

            <select value={room} onChange={(e) => setRoom(e.target.value)} style={{ width: "100%" }}>
                <option value="nodeJS">nodeJS</option>
                <option value="devops">devops</option>
                <option value="general">general</option>
            </select>

            <div style={{ marginTop: 10, border: "1px solid #ddd", padding: 10, borderRadius: 6 }}>
                <b>Room:</b> {joinedRoom ? joinedRoom : "(not joined)"}

                <div style={{ marginTop: 8 }}>
                    {!joinedRoom ? (
                        <button onClick={join}>Join</button>
                    ) : (
                        <button onClick={leave}>Leave</button>
                    )}
                </div>

                <div style={{ height: 260, overflow: "auto", border: "1px solid #eee", marginTop: 10, padding: 10 }}>
                    {joinedRoom && messages.length === 0 ? (
                        <div>No messages yet.</div>
                    ) : (
                        messages.map((m, idx) => (
                            <div key={idx} style={{ marginBottom: 8 }}>
                                <b>{m.from}</b> {new Date(m.at).toLocaleTimeString()} <br />
                                {m.text}
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={send} style={{ marginTop: 10 }}>
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={!joinedRoom}
                        placeholder={joinedRoom ? "Type message..." : "Join a room first"}
                        style={{ width: "100%", padding: 8 }}
                    />
                    <button type="submit" disabled={!joinedRoom || !text.trim()} style={{ marginTop: 8 }}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}




