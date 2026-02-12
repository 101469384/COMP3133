import React, { useState } from "react";
import { apiFetch } from "../api/http.js";

export default function Login({ goSignup, onLogin }) {
    const [form, setForm] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setMsg("");
        try {
            const data = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            onLogin();
        } catch (err) {
            setMsg("❌ " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
                <h1 className="text-2xl font-bold mb-4">Login</h1>

                <form className="space-y-3" onSubmit={submit}>
                    <input
                        className="w-full border rounded-xl p-3"
                        placeholder="username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                    <input
                        className="w-full border rounded-xl p-3"
                        placeholder="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button className="w-full bg-black text-white rounded-xl p-3">Login</button>
                </form>

                {msg && <p className="mt-3 text-sm">{msg}</p>}

                <button className="mt-4 text-sm underline" onClick={goSignup}>
                    Create account
                </button>
            </div>
        </div>
    );
}
