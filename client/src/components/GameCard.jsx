import React from 'react';
import { Calendar, Clock, Trophy, Edit2, Trash2, Heart } from 'lucide-react';

const GameCard = ({ game, onEdit, onDelete, onToggleFavorite }) => {
    // Score color logic aligned with Apple health rings colors
    const getMetaColor = (score) => {
        if (score >= 80) return 'text-success';
        if (score >= 50) return 'text-warning';
        return 'text-danger';
    };

    return (
        <div className="group relative bg-surface/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:bg-surface/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50">

            {/* Abstract Cover Generation based on genre */}
            <div className={`h-32 w-full bg-gradient-to-br opacity-80 transition-opacity duration-500 group-hover:opacity-100 relative overflow-hidden
        ${game.genre.includes('Action') ? 'from-orange-500/20 to-red-600/20' :
                    game.genre.includes('RPG') ? 'from-purple-500/20 to-indigo-600/20' :
                        game.genre.includes('Simulation') ? 'from-green-500/20 to-teal-600/20' :
                            'from-blue-500/20 to-cyan-600/20'}`
            }>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>

                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(game._id); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5 text-white/50 hover:text-red-500 hover:bg-black/40 transition-all duration-300"
                >
                    <Heart size={18} fill={game.isFavorite ? "currentColor" : "none"} className={game.isFavorite ? "text-red-500" : ""} />
                </button>
            </div>

            <div className="p-5 relative -mt-12">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white tracking-tight mb-1 truncate" title={game.titre}>{game.titre}</h3>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{game.developpeur}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {game.genre.slice(0, 3).map((g, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 text-[10px] font-semibold tracking-wide rounded-full bg-white/5 text-text-muted border border-white/5">
                            {g}
                        </span>
                    ))}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div className="bg-surface-highlight/30 rounded-xl p-3 flex flex-col gap-1 items-start backdrop-blur-sm border border-white/5">
                        <div className="flex items-center gap-1.5 text-text-muted text-xs">
                            <Calendar size={12} />
                            <span>Sortie</span>
                        </div>
                        <span className="font-medium text-text">{game.annee_sortie}</span>
                    </div>
                    <div className="bg-surface-highlight/30 rounded-xl p-3 flex flex-col gap-1 items-start backdrop-blur-sm border border-white/5">
                        <div className="flex items-center gap-1.5 text-text-muted text-xs">
                            <Clock size={12} />
                            <span>Temps</span>
                        </div>
                        <span className="font-medium text-text">{game.temps_jeu_heures}h</span>
                    </div>
                </div>

                {/* Footer info */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                        <div className={`text-lg font-bold ${getMetaColor(game.metacritic_score)}`}>{game.metacritic_score}</div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-text-muted leading-none">Meta</span>
                            <span className="text-[10px] text-text-muted leading-none">Score</span>
                        </div>
                    </div>

                    {game.termine && (
                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                            <Trophy size={12} /> Complété
                        </span>
                    )}
                </div>

                {/* Actions Overlay (Glass) */}
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-xl flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 rounded-2xl">
                    <button
                        onClick={() => onEdit(game)}
                        className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-surface-highlight border border-white/10 hover:scale-110 hover:border-primary/50 hover:text-white transition-all text-text-muted gap-2"
                    >
                        <Edit2 size={20} />
                        <span className="text-[10px] font-medium">Éditer</span>
                    </button>
                    <button
                        onClick={() => onDelete(game._id)}
                        className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-surface-highlight border border-white/10 hover:scale-110 hover:border-red-500/50 hover:text-red-500 transition-all text-text-muted gap-2"
                    >
                        <Trash2 size={20} />
                        <span className="text-[10px] font-medium">Suppr.</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GameCard;
