import React, { useState, useEffect } from 'react';
import { X, Save, UploadCloud } from 'lucide-react';

const GameForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        titre: '',
        genre: '',
        plateforme: '',
        editeur: '',
        developpeur: '',
        annee_sortie: new Date().getFullYear(),
        metacritic_score: 75,
        temps_jeu_heures: 0,
        termine: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                genre: initialData.genre.join(', '),
                plateforme: initialData.plateforme.join(', ')
            });
        } else {
            setFormData({
                titre: '',
                genre: '',
                plateforme: '',
                editeur: '',
                developpeur: '',
                annee_sortie: new Date().getFullYear(),
                metacritic_score: 75,
                temps_jeu_heures: 0,
                termine: false
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            annee_sortie: parseInt(formData.annee_sortie),
            metacritic_score: parseInt(formData.metacritic_score),
            temps_jeu_heures: parseFloat(formData.temps_jeu_heures),
            genre: formData.genre.split(',').map(s => s.trim()).filter(Boolean),
            plateforme: formData.plateforme.split(',').map(s => s.trim()).filter(Boolean)
        };
        onSubmit(formattedData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="bg-[#1c1c1e] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 animate-scale-in border border-white/10">

                <div className="sticky top-0 z-20 bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{initialData ? 'Modifier' : 'Nouveau Jeu'}</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-highlight text-text-muted hover:bg-white/10 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Main Section */}
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Titre du jeu</label>
                            <input
                                type="text"
                                name="titre"
                                required
                                value={formData.titre}
                                onChange={handleChange}
                                className="w-full bg-surface text-3xl font-bold bg-transparent border-b-2 border-white/10 focus:border-primary focus:outline-none py-2 placeholder-white/10 transition-colors"
                                placeholder="Ex: Cyberpunk 2077"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white border-b border-white/5 pb-2">Détails</h3>

                            <div className="space-y-2">
                                <label className="text-xs text-text-muted">Genres</label>
                                <input className="input-field w-full" type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="RPG, FPS..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-text-muted">Plateformes</label>
                                <input className="input-field w-full" type="text" name="plateforme" value={formData.plateforme} onChange={handleChange} placeholder="PC, PS5..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-text-muted">Studio</label>
                                <input className="input-field w-full" type="text" name="developpeur" value={formData.developpeur} onChange={handleChange} placeholder="CD Projekt Red" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white border-b border-white/5 pb-2">Statistiques</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-text-muted">Année</label>
                                    <input className="input-field w-full text-center font-mono" type="number" name="annee_sortie" value={formData.annee_sortie} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-text-muted">Metascore</label>
                                    <div className="relative">
                                        <input
                                            className={`input-field w-full text-center font-bold ${formData.metacritic_score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}
                                            type="number" name="metacritic_score" value={formData.metacritic_score} onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-xs text-text-muted">
                                    <label>Temps de jeu</label>
                                    <span>{formData.temps_jeu_heures}h</span>
                                </div>
                                <input
                                    type="range"
                                    name="temps_jeu_heures"
                                    min="0" max="200" step="0.5"
                                    value={formData.temps_jeu_heures}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-highlight/30 cursor-pointer hover:bg-surface-highlight/50 transition-colors border border-white/5">
                                    <input
                                        type="checkbox"
                                        name="termine"
                                        checked={formData.termine}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-white/20 bg-surface/50 text-success focus:ring-success/50"
                                    />
                                    <span className="flex-1 text-sm font-medium">Jeu Terminé</span>
                                    {formData.termine && <span className="text-xs text-success font-semibold px-2 py-1 bg-success/10 rounded-md">Bravo!</span>}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2 px-8 py-3 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5"
                        >
                            <Save size={18} />
                            <span>Sauvegarder</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GameForm;
