const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const collection = db.collection('games');

    // GET /api/stats
    router.get('/', async (req, res) => {
        try {
            const stats = await collection.aggregate([
                {
                    $group: {
                        _id: null, // On groupe tout le monde ensemble
                        totalGames: { $sum: 1 },
                        totalPlayTime: { $sum: "$temps_jeu_heures" },
                        averageMetacritic: { $avg: "$metacritic_score" },
                        completedGames: {
                            $sum: { $cond: ["$termine", 1, 0] }
                        },
                        genres: { $push: "$genre" } // On collecte tous les tableaux de genres
                    }
                }
            ]).toArray();

            if (stats.length === 0) {
                return res.json({
                    totalGames: 0,
                    totalPlayTime: 0,
                    averageMetacritic: 0,
                    completedGames: 0,
                    topGenre: "N/A"
                });
            }

            const result = stats[0];

            // Calcul du genre le plus fréquent (un peu de JS car les genres sont des tableaux)
            // Flatten genres array
            const allGenres = result.genres.flat();
            const genreCounts = {};
            let topGenre = "N/A";
            let maxCount = 0;

            for (const g of allGenres) {
                genreCounts[g] = (genreCounts[g] || 0) + 1;
                if (genreCounts[g] > maxCount) {
                    maxCount = genreCounts[g];
                    topGenre = g;
                }
            }

            res.json({
                totalGames: result.totalGames,
                totalPlayTime: result.totalPlayTime,
                averageMetacritic: Math.round(result.averageMetacritic * 10) / 10, // Arrondi 1 décimale
                completedGames: result.completedGames,
                topGenre: topGenre
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur lors du calcul des statistiques." });
        }
    });

    return router;
};
