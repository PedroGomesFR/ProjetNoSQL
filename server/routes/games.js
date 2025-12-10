const express = require('express');
const { ObjectId } = require('mongodb');
const { validateGame } = require('../utils/validation');

const router = express.Router();

module.exports = (db) => {
    const collection = db.collection('games');

    // GET /api/games - Lister tous les jeux (avec filtres)
    router.get('/', async (req, res) => {
        try {
            const { genre, plateforme } = req.query;
            const query = {};

            if (genre) {
                query.genre = genre;
            }
            if (plateforme) {
                query.plateforme = plateforme;
            }

            const games = await collection.find(query).toArray();
            res.json(games);
        } catch (err) {
            res.status(500).json({ error: "Erreur lors de la récupération des jeux." });
        }
    });

    // GET /api/games/export - Export des données (JSON)
    router.get('/export', async (req, res) => {
        try {
            const games = await collection.find({}).toArray();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=games_collection.json');
            res.send(JSON.stringify(games, null, 2));
        } catch (err) {
            res.status(500).json({ error: "Erreur lors de l'export des données." });
        }
    });

    // GET /api/games/:id - Obtenir un jeu spécifique
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID invalide." });
            }
            const game = await collection.findOne({ _id: new ObjectId(id) });

            if (!game) {
                return res.status(404).json({ error: "Jeu non trouvé." });
            }
            res.json(game);
        } catch (err) {
            res.status(500).json({ error: "Erreur serveur." });
        }
    });

    // POST /api/games - Ajouter un nouveau jeu
    router.post('/', validateGame, async (req, res) => {
        try {
            const newGame = {
                ...req.body,
                date_ajout: new Date(),
                date_modification: new Date()
            };

            const result = await collection.insertOne(newGame);
            // Pour les versions récentes du driver mongo, result.insertedId contient l'ID
            // On retourne l'objet complet
            res.status(201).json({ ...newGame, _id: result.insertedId });
        } catch (err) {
            res.status(500).json({ error: "Erreur lors de l'ajout du jeu." });
        }
    });

    // PUT /api/games/:id - Modifier un jeu
    router.put('/:id', validateGame, async (req, res) => {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID invalide." });
            }
            const updates = {
                ...req.body,
                date_modification: new Date()
            };
            // On ne modifie pas l'ID ni la date d'ajout
            delete updates._id;
            delete updates.date_ajout;

            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updates },
                { returnDocument: 'after' } // Retourne le document modifié
            );

            if (!result) { // Si result est null (mongo driver v4+ findOneAndUpdate retourne l'objet ou null, ou result.value)
                // Note: Avec les drivers récents ça peut varier, utilisons updateOne pour être standard ou findOneAndUpdate.
                // Pour simplifier et être sûr de la compatibilité, je vais utiliser updateOne puis findOne.
                // Mais findOneAndUpdate est plus atomique. Utilisons la syntaxe standard v4+
            }

            // Tentative standard updateOne
            const updateResult = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updates }
            );

            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ error: "Jeu non trouvé." });
            }

            const updatedGame = await collection.findOne({ _id: new ObjectId(id) });
            res.json(updatedGame);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur lors de la modification du jeu." });
        }
    });

    // DELETE /api/games/:id - Supprimer un jeu
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID invalide." });
            }
            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Jeu non trouvé." });
            }
            res.json({ message: "Jeu supprimé avec succès." });
        } catch (err) {
            res.status(500).json({ error: "Erreur lors de la suppression." });
        }
    });

    // POST /api/games/:id/favorite - Toggle favoris (Ajout d'un champ isFavorite)
    router.post('/:id/favorite', async (req, res) => {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID invalide." });
            }
            const game = await collection.findOne({ _id: new ObjectId(id) });
            if (!game) {
                return res.status(404).json({ error: "Jeu non trouvé." });
            }

            const newFavoriteStatus = !game.isFavorite;

            await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { isFavorite: newFavoriteStatus } }
            );

            res.json({ isFavorite: newFavoriteStatus });

        } catch (err) {
            res.status(500).json({ error: "Erreur serveur." });
        }
    });

    return router;
};
