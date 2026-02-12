
import React, { useEffect, useMemo, useState } from "react";

export default function PrivateChat({ socket, user, onlineUsers = [] }) {
    const [toUser, setToUser] = useState("");
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    const options = useMemo(() => {
        return (Array.isArray(onlineUsers) ? onlineUsers : []).filter((u) => u && u !== user?.username);
    }, [onlineUsers, user]);

    useEffect(() => {
        if (!socket) return;

        const onMsg = (msg) => {
            if (!msg) return;


            const partner = toUser;
            if (!partner) return;

            const isRelated =
                (msg.from === user?.username && msg.to === partner) ||
                (msg.from === partner && msg.to === user?.username);

            if (isRelated) setMessages((prev) => [...prev, msg]);
        };

        socket.on("private:message", onMsg);
        return () => socket.off("private:message", onMsg);
    }, [socket, toUser, user]);


    useEffect(() => {
        setMessages([]);
        setText("");
    }, [toUser]);

    const send = (e) => {
        e.preventDefault();
        if (!socket) return;
        if (!toUser) return;
        if (!text.trim()) return;

        socket.emit("private:message", {
            to: toUser,
            from: user.username,
            text: text.trim(),
            at: Date.now(),
        });

        setText("");
    };

    return (
        <div>
            <h3>Users</h3>

            <select
                value={toUser}
                onChange={(e) => setToUser(e.target.value)}
                style={{ width: "100%" }}
            >
                <option value="">Select a user</option>
                {options.map((u) => (
                    <option key={u} value={u}>
                        {u}
                    </option>
                ))}
            </select>

            <div style={{ marginTop: 10, border: "1px solid #ddd", padding: 10, borderRadius: 6 }}>
                <b>Private chat with:</b> {toUser ? toUser : "(select user)"}

                <div style={{ height: 260, overflow: "auto", border: "1px solid #eee", marginTop: 10, padding: 10 }}>
                    {!toUser ? (
                        <div>Select a user to start chat.</div>
                    ) : messages.length === 0 ? (
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
                        disabled={!toUser}
                        placeholder={toUser ? "Type message..." : "Select a user first"}
                        style={{ width: "100%", padding: 8 }}
                    />
                    <button type="submit" disabled={!toUser || !text.trim()} style={{ marginTop: 8 }}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}




