import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api';
import WorkshopCard from '../components/WorkshopCard';

export default function Home() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/workshops/')
            .then((res) => setWorkshops(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div class="max-w-6xl mx-auto px-6 py-8">
            <div class="mb-8 text-center md:text-left">
                <h1 class="text-3xl font-extrabold text-slate-100 mb-2">Robotics & Software Workshops</h1>
                <p class="text-slate-400">Discover and share educational programs for Arduino, ESP, Web, and GameDev.</p>
            </div>

            {loading ? (
                <div class="text-center py-12 text-slate-400">Loading workshops...</div>
            ) : workshops.length === 0 ? (
                <div class="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p class="text-slate-400">No workshops created yet.</p>
                </div>
            ) : (
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workshops.map((w) => (
                        <WorkshopCard key={w.id} workshop={w} />
                    ))}
                </div>
            )}
        </div>
    );
}