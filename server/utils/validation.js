const validateGame = (req, res, next) => {
  const { titre, genre, plateforme, editeur, developpeur, annee_sortie, metacritic_score, temps_jeu_heures, termine } = req.body;
  const errors = [];

  // Validation Titre
  if (!titre || typeof titre !== 'string' || titre.trim().length < 1) {
    errors.push("Le titre est requis et doit être une chaîne non vide.");
  }

  // Validation Genre
  if (!genre || !Array.isArray(genre) || genre.length < 1) {
    errors.push("Au moins un genre est requis.");
  } else {
      if(!genre.every(g => typeof g === 'string')) {
          errors.push("Les genres doivent être des chaînes de caractères.");
      }
  }

  // Validation Plateforme
  if (!plateforme || !Array.isArray(plateforme) || plateforme.length < 1) {
    errors.push("Au moins une plateforme est requise.");
  } else {
       if(!plateforme.every(p => typeof p === 'string')) {
          errors.push("Les plateformes doivent être des chaînes de caractères.");
      }
  }

  // Validation Année de sortie
  const currentYear = new Date().getFullYear();
  if (annee_sortie !== undefined) {
      if (typeof annee_sortie !== 'number' || annee_sortie < 1970 || annee_sortie > currentYear) {
        errors.push(`L'année de sortie doit être un nombre entre 1970 et ${currentYear}.`);
      }
  }

  // Validation Metacritic Score
  if (metacritic_score !== undefined) {
    if (typeof metacritic_score !== 'number' || metacritic_score < 0 || metacritic_score > 100) {
      errors.push("Le score Metacritic doit être un nombre entre 0 et 100.");
    }
  }

  // Validation Temps de jeu
  if (temps_jeu_heures !== undefined) {
    if (typeof temps_jeu_heures !== 'number' || temps_jeu_heures < 0) {
      errors.push("Le temps de jeu doit être un nombre positif.");
    }
  }

  // Validation Terminé
  if (termine !== undefined && typeof termine !== 'boolean') {
      errors.push("Le champ 'termine' doit être un booléen.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateGame };
