import React, { useState } from "react";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";

export default function App() {
    const [page, setPage] = useState(() => localStorage.getItem("token") ? "chat" : "login");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setPage("login");
    };

    let content = null;

    if (page === "signup") {
        content = <Signup goLogin={() => setPage("login")} />;
    } else if (page === "login") {
        content = (
            <Login
                goSignup={() => setPage("signup")}
                onLogin={() => setPage("chat")}
            />
        );
    } else {
        content = (
            <Chat
                user={JSON.parse(localStorage.getItem("user"))}
                onLogout={logout}
            />
        );
    }

    return (
        <div className="app-container">
            <div className="app-header">Chat App</div>

            <div className="section">
                {content}
            </div>
        </div>
    );
}


