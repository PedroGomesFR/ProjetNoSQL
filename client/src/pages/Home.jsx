import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download, Search, Command } from 'lucide-react';
import { getGames, createGame, updateGame, deleteGame, toggleFavorite, exportGames } from '../services/api';
import GameCard from '../components/GameCard';
import GameForm from '../components/GameForm';

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal & Edit
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGame, setEditingGame] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        genre: '',
        plateforme: ''
    });

    const fetchGames = async () => {
        setLoading(true);
        try {
            const serverFilters = {};
            if (filters.genre) serverFilters.genre = filters.genre;
            if (filters.plateforme) serverFilters.plateforme = filters.plateforme;

            const data = await getGames(serverFilters);
            setGames(data);
        } catch (err) {
            setError("Erreur de connexion serveur.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, [filters.genre, filters.plateforme]);

    const handleCreate = async (gameData) => {
        try {
            await createGame(gameData);
            setIsFormOpen(false);
            fetchGames();
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    };

    const handleUpdate = async (gameData) => {
        try {
            await updateGame(editingGame._id, gameData);
            setIsFormOpen(false);
            setEditingGame(null);
            fetchGames();
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer définitivement ce jeu ?")) {
            try {
                await deleteGame(id);
                fetchGames();
            } catch (err) {
                alert("Erreur suppression.");
            }
        }
    };

    const handleToggleFavorite = async (id) => {
        try {
            const res = await toggleFavorite(id);
            setGames(games.map(g => g._id === id ? { ...g, isFavorite: res.isFavorite } : g));
        } catch (err) { console.error(err); }
    };

    const openCreateModal = () => {
        setEditingGame(null);
        setIsFormOpen(true);
    };

    const openEditModal = (game) => {
        setEditingGame(game);
        setIsFormOpen(true);
    };

    const filteredGames = games.filter(g =>
        g.titre.toLowerCase().includes(filters.search.toLowerCase())
    );

    return (
        <div className="space-y-12">

            {/* Header Section */}
            <div className="flex flex-col items-center text-center space-y-4 py-8">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent pb-2">
                    Ma Collection.
                </h1>
                <p className="text-lg text-text-muted max-w-2xl font-light">
                    Une interface minimaliste pour explorer, gérer et analyser vos jeux vidéo favoris.
                </p>

                <div className="pt-6 flex gap-4">
                    <button
                        onClick={openCreateModal}
                        className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-glow"
                    >
                        <Plus size={18} />
                        <span>Nouveau Jeu</span>
                    </button>
                    <button
                        onClick={exportGames}
                        className="btn-secondary flex items-center gap-2 px-6 py-2.5"
                    >
                        <Download size={18} />
                        <span>Exporter</span>
                    </button>
                </div>
            </div>

            {/* Control Bar (Glassmorphism) */}
            <div className="sticky top-20 z-40 mx-auto max-w-2xl">
                <div className="glass-panel rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-black/50">
                    <div className="flex-grow relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full bg-transparent border-none text-text placeholder-text-muted/50 pl-11 pr-4 py-2.5 focus:ring-0 text-sm font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                            <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-text-muted">⌘</span>
                            <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-text-muted">K</span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-white/10 mx-2"></div>

                    <div className="flex gap-2 pr-2">
                        <select
                            value={filters.genre}
                            onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                            className="bg-surface-highlight/50 hover:bg-surface-highlight text-xs font-medium text-text px-3 py-2 rounded-lg border border-white/5 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="">Tous Genres</option>
                            <option value="Action">Action</option>
                            <option value="Aventure">Aventure</option>
                            <option value="RPG">RPG</option>
                        </select>
                        {/* Plus d'options de tri pourraient aller ici */}
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/20 animate-spin border-t-primary"></div>
                    </div>
                </div>
            ) : filteredGames.length === 0 ? (
                <div className="text-center py-32 opacity-50">
                    <p className="text-xl font-medium mb-2">Aucun jeu trouvé</p>
                    <p className="text-sm">Essayez de modifier votre recherche ou ajoutez un nouveau jeu.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                    {filteredGames.map(game => (
                        <GameCard
                            key={game._id}
                            game={game}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <GameForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={editingGame ? handleUpdate : handleCreate}
                initialData={editingGame}
            />
        </div>
    );
};

export default Home;
