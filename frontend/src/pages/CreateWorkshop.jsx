import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateWorkshop() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ageCategory, setAgeCategory] = useState('8-12');
    const [githubUrl, setGithubUrl] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/workshops/', {
                title,
                description,
                age_category: ageCategory,
                github_url: githubUrl,
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create workshop');
        }
    };

    return (
        <div class="max-w-2xl mx-auto mt-10 p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
            <h2 class="text-2xl font-bold mb-6 text-slate-100">Add New Workshop</h2>
            {error && <div class="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded-lg">{error}</div>}
            <form onSubmit={handleSubmit} class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Title</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Arduino Obstacle Avoidance Robot"
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <textarea
                        required
                        rows="3"
                        placeholder="Brief overview of the project and educational objectives..."
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Target Age Category</label>
                    <select
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                        value={ageCategory}
                        onChange={(e) => setAgeCategory(e.target.value)}
                    >
                        <option value="5-7">5-7 years</option>
                        <option value="8-12">8-12 years</option>
                        <option value="13-16">13-16 years</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">GitHub Repository URL</label>
                    <input
                        type="url"
                        required
                        placeholder="https://github.com/user/repository"
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    class="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 rounded-lg transition"
                >
                    Publish Workshop
                </button>
            </form>
        </div>
    );
}