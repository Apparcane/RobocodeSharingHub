import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { Trash2, ExternalLink, ArrowLeft, Edit2, User, Check, X } from 'lucide-react';
import api from '../api';

export default function WorkshopDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Состояние редактирования
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        age_category: '',
        github_url: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me')
                .then(res => setCurrentUser(res.data))
                .catch(() => { });
        }

        api.get(`/workshops/${id}`)
            .then((res) => {
                setWorkshop(res.data);
                setEditFormData({
                    title: res.data.title,
                    description: res.data.description,
                    age_category: res.data.age_category,
                    github_url: res.data.github_url
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Проверка прав: текущий юзер = автор ИЛИ админ
    const canManage = currentUser && workshop && (currentUser.id === workshop.author_id || currentUser.is_admin);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/workshops/${id}`, editFormData);

            // Обновляем локальное состояние воркшопа
            setWorkshop(prev => ({ ...prev, ...editFormData }));
            setIsEditing(false);
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to update workshop');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this workshop?')) return;
        try {
            await api.delete(`/workshops/${id}`);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to delete workshop');
        }
    };

    if (loading) return <div className="text-center py-16 text-slate-400">Loading...</div>;
    if (!workshop) return <div className="text-center py-16 text-red-400">Workshop not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-slate-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Workshops
            </button>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-sky-950 text-sky-400 border border-sky-800/60 text-xs px-2.5 py-1 rounded-full font-medium">
                                Age: {workshop.age_category}
                            </span>

                            {/* Автор мастер-класса */}
                            {workshop.author_username && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-sky-400" /> Created by <strong className="text-slate-200">@{workshop.author_username}</strong>
                                </span>
                            )}
                        </div>

                        {!isEditing && <h1 className="text-3xl font-bold text-slate-100">{workshop.title}</h1>}
                    </div>

                    {/* Кнопки Edit и Delete только для Автора или Админа */}
                    {canManage && !isEditing && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1 text-sky-400 hover:text-sky-300 bg-sky-950/50 hover:bg-sky-900/50 px-3 py-1.5 rounded-lg border border-sky-800/50 transition text-sm font-medium"
                            >
                                <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-800/50 transition text-sm font-medium"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Инлайн-форма редактирования */}
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-4 my-4 p-4 bg-slate-900/80 border border-slate-700 rounded-lg">
                        <h3 className="text-sm font-semibold text-sky-400">Editing Workshop Details</h3>

                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Age Category</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                                    value={editFormData.age_category}
                                    onChange={(e) => setEditFormData({ ...editFormData, age_category: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">GitHub URL</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                                    value={editFormData.github_url}
                                    onChange={(e) => setEditFormData({ ...editFormData, github_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Description</label>
                            <textarea
                                rows="3"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-medium transition"
                            >
                                <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium transition"
                            >
                                <Check className="w-3.5 h-3.5" /> Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-slate-300 mb-6 leading-relaxed">{workshop.description}</p>
                )}

                {!isEditing && (
                    <a
                        href={workshop.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 text-sky-300 px-4 py-2 rounded-lg transition"
                    >
                        View Source Repository <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            {/* README block */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 prose prose-invert max-w-none">
                <h2 className="text-xl font-bold text-slate-200 mb-4 pb-2 border-b border-slate-700">Project README.md</h2>
                {workshop.readme_content ? (
                    <div
                        className="space-y-4 text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: marked.parse(workshop.readme_content) }}
                    />
                ) : (
                    <p className="text-slate-400 italic">No README content found on repository.</p>
                )}
            </div>
        </div>
    );
}