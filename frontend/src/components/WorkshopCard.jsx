import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, User } from 'lucide-react';

export default function WorkshopCard({ workshop }) {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col justify-between hover:border-sky-500/50 transition shadow-lg">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className="bg-sky-950 text-sky-400 border border-sky-800/60 text-xs px-2.5 py-1 rounded-full font-medium">
                        Age: {workshop.age_category}
                    </span>

                    {/* Отображение автора */}
                    {workshop.author_username && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-700/50">
                            <User className="w-3 h-3 text-sky-400" /> @{workshop.author_username}
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{workshop.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{workshop.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <a
                    href={workshop.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1 transition"
                >
                    GitHub <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                    to={`/workshops/${workshop.id}`}
                    className="flex items-center gap-1 text-sm bg-slate-700 hover:bg-slate-600 text-sky-300 px-3 py-1.5 rounded-lg transition"
                >
                    <BookOpen className="w-4 h-4" /> View README
                </Link>
            </div>
        </div>
    );
}