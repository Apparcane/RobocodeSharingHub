import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, LogOut, PlusCircle, User } from 'lucide-react';
import api from '../api';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Флаг загрузки пользователя

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, [location.pathname]);

    useEffect(() => {
        const handleAuthChange = () => {
            setLoading(true); // Включаем легкий лоадер на время запроса
            checkAuth();
        };

        window.addEventListener('authChange', handleAuthChange);
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.dispatchEvent(new Event('authChange'));
        navigate('/login');
    };

    return (
        <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-sky-400">
                <Code2 className="w-7 h-7" />
                <span>Robocode Sharing Hub</span>
            </Link>

            <div className="flex items-center gap-4">
                {loading ? (
                    // Небольшой скелетон вместо резкого смены кнопок Вход -> Профиль
                    <div className="h-8 w-28 bg-slate-700/60 animate-pulse rounded-lg" />
                ) : user ? (
                    <>
                        <Link
                            to="/create"
                            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Workshop
                        </Link>

                        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 text-sm">
                            <User className="w-4 h-4 text-sky-400" />
                            <span className="font-medium">{user.username}</span>
                            {user.is_admin && (
                                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border border-amber-500/40">
                                    Admin
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg font-medium transition text-sm cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition">
                            Login
                        </Link>
                        <Link to="/register" className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}