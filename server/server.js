const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001; // Port 5001 pour éviter les conflits standard

const MONGODB_URI = "mongodb+srv://nosql:nosql@nosql.rfgqrva.mongodb.net/?appName=nosql";
const DB_NAME = "game_collection_db";

// Middleware
app.use(cors());
app.use(express.json());

// Debug Middleware
app.use((req, res, next) => {
    console.log(`[DEBUG] Request: ${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/', (req, res) => {
    res.send('API is running');
});


let db;

// Connexion MongoDB
MongoClient.connect(MONGODB_URI)
    .then(client => {
        console.log(`Connecté à MongoDB : ${MONGODB_URI}`);
        db = client.db(DB_NAME);

        // Initialisation des routes après la connexion DB
        const gamesRouter = require('./routes/games')(db);
        const statsRouter = require('./routes/stats')(db);

        app.use('/api/games', gamesRouter);
        app.use('/api/stats', statsRouter);

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Erreur de connexion à MongoDB :", err);
        process.exit(1);
    });
