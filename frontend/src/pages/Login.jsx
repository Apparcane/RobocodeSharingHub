import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Code2, Lock, Mail } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        setError('');
        setLoading(true);

        try {
            const params = new URLSearchParams();
            params.append('username', formData.username);
            params.append('password', formData.password);

            const response = await api.post('/auth/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const token = response.data.access_token || response.data.token;

            if (token) {
                localStorage.setItem('token', token);

                // Оповещаем Navbar
                window.dispatchEvent(new Event('authChange'));

                // Переходим на главную без перезагрузки браузера
                navigate('/');
            } else {
                setError('No token received');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-950 border border-sky-800 rounded-xl mb-3 text-sky-400">
                        <Code2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
                    <p className="text-slate-400 text-sm mt-1">Sign in to Robocode Sharing Hub</p>
                </div>

                {error && (
                    <div className="bg-red-950/50 border border-red-800/60 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                            Username or Email
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="admin or user@example.com"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="••••••••"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <span>Signing in...</span>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" /> Sign In
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-sky-400 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}