import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', { email, username, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div class="max-w-md mx-auto mt-16 p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
            <h2 class="text-2xl font-bold mb-6 text-center text-slate-100">Create Account</h2>
            {error && <div class="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded-lg">{error}</div>}
            <form onSubmit={handleSubmit} class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Username</label>
                    <input
                        type="text"
                        required
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    class="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 rounded-lg transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
}