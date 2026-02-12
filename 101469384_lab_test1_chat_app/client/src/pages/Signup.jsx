import React, { useState } from "react";
import { apiFetch } from "../api/http.js";

export default function Signup({ goLogin }) {
    const [form, setForm] = useState({ username: "", firstname: "", lastname: "", password: "" });
    const [msg, setMsg] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setMsg("");
        try {
            await apiFetch("/api/auth/signup", { method: "POST", body: JSON.stringify(form) });
            setMsg("✅ Account created. Now login.");
        } catch (err) {
            setMsg("❌ " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
                <h1 className="text-2xl font-bold mb-4">Signup</h1>

                <form className="space-y-3" onSubmit={submit}>
                    {["username", "firstname", "lastname", "password"].map((k) => (
                        <input
                            key={k}
                            className="w-full border rounded-xl p-3"
                            placeholder={k}
                            type={k === "password" ? "password" : "text"}
                            value={form[k]}
                            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                        />
                    ))}
                    <button className="w-full bg-black text-white rounded-xl p-3">Create account</button>
                </form>

                {msg && <p className="mt-3 text-sm">{msg}</p>}

                <button className="mt-4 text-sm underline" onClick={goLogin}>
                    Go to login
                </button>
            </div>
        </div>
    );
}
