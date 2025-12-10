import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import { PieChart, Clock, List, Trophy, Star } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtext, color = "text-primary" }) => (
    <div className="bg-surface border border-white/5 p-6 rounded-xl flex items-center gap-4 hover:border-white/10 transition-colors">
        <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-text-muted font-medium">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {subtext && <p className="text-xs text-text-muted mt-1">{subtext}</p>}
        </div>
    </div>
);

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>;
    if (!stats) return <div className="text-center py-20 text-text-muted">Aucune statistique disponible.</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Statistiques</h1>
                <p className="text-text-muted mt-1">Vue d'ensemble de votre collection</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={List}
                    title="Total Jeux"
                    value={stats.totalGames}
                    color="text-blue-400"
                />
                <StatCard
                    icon={Clock}
                    title="Temps de Jeu"
                    value={`${stats.totalPlayTime}h`}
                    subtext="Heures totales cumulées"
                    color="text-orange-400"
                />
                <StatCard
                    icon={Star}
                    title="Note Moyenne"
                    value={stats.averageMetacritic}
                    subtext="Score Metacritic moyen"
                    color="text-yellow-400"
                />
                <StatCard
                    icon={Trophy}
                    title="Jeux Terminés"
                    value={stats.completedGames}
                    subtext={`${((stats.completedGames / stats.totalGames) * 100).toFixed(1)}% de la collection`}
                    color="text-green-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface border border-white/5 p-8 rounded-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <PieChart size={20} className="text-accent" />
                        Genre Favori
                    </h3>
                    <div className="text-center py-8">
                        <p className="text-text-muted mb-2">Le genre qui domine votre collection est :</p>
                        <div className="text-5xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
                            {stats.topGenre || "Aucun"}
                        </div>
                    </div>
                </div>

                {/* Placeholder for more charts or lists */}
                <div className="bg-surface border border-white/5 p-8 rounded-xl flex items-center justify-center text-text-muted">
                    <p className="italic">Plus de graphiques à venir...</p>
                </div>
            </div>
        </div>
    );
};

export default Stats;
