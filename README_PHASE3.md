# 🚀 Phase 3 - Modernisation technique

## Structure des fichiers

```
H:\lemondedescurieux\
├── vite.config.js              # Configuration Vite
├── package.json                # Dépendances et scripts npm
├── index-vite.html             # Page de test Vite + Alpine.js
├── src/                        # Code source moderne
│   ├── main.js                 # Point d'entrée Alpine.js
│   ├── components/             # Composants Alpine.js
│   │   ├── dashboard.js        # Dashboard principal
│   │   ├── heart-system.js     # Système de cœurs/vies
│   │   └── streak-manager.js   # Gestion des streaks
│   └── modules/                # Modules utilitaires
│       ├── storage.js          # Gestion localStorage avancée
│       └── analytics.js        # Tracking analytics local
└── analytics/                  # Backend Python (à venir)
    └── venv/                   # Environnement virtuel Python
```

## Installation

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

3. **Ouvrir dans le navigateur** :
   - http://localhost:5173

## Scripts disponibles

- `npm run dev` : Serveur de développement avec hot reload
- `npm run build` : Build de production
- `npm run preview` : Prévisualiser le build
- `npm run serve` : Servir le build en réseau local

## Technologies utilisées

- **Vite** : Build tool moderne et rapide
- **Alpine.js 3.x** : Framework JavaScript réactif léger
- **Chart.js** : Graphiques et visualisations
- **jsPDF** : Génération de PDF
- **Vanilla CSS** : Styles personnalisés (migration future vers Tailwind)

## Architecture Alpine.js

### Composants principaux

1. **dashboardApp** : Gestion de l'état global et navigation
2. **heartSystem** : Système de vies style Duolingo
3. **streakManager** : Gestion des séries de jours consécutifs
4. **modal** : Système de modals réutilisable
5. **notifications** : Notifications toast

### Magic properties

- `$storage` : Accès au gestionnaire de stockage
- `$analytics` : Tracking des événements
- `$charts` : Gestion des graphiques Chart.js
- `$pdf` : Génération de PDF

### Stores Alpine

- `app` : État global de l'application (thème, son, mode hors ligne)

## Modules utilitaires

### StorageManager

- Gestion du localStorage avec préfixe et versioning
- Migration automatique des anciennes données
- Support du mode hors ligne (memory storage)
- Chiffrement (préparé pour activation)

### AnalyticsTracker

- Tracking local des événements utilisateur
- Sessions et métriques de performance
- Rapports d'utilisation
- Export des données

## Prochaines étapes

1. **Intégration progressive** :
   - Remplacer index.html par la version Alpine.js
   - Migrer les quiz interactifs
   - Convertir les mini-jeux

2. **Analytics Python** :
   - Créer `analytics/app.py`
   - Implémenter les algorithmes ML
   - API REST pour recommandations

3. **PWA avancée** :
   - Service Worker avec stratégies de cache
   - Mode hors ligne complet
   - Notifications push

4. **Tests utilisateur** :
   - Sessions hebdomadaires avec l'enfant testeur
   - Collecte des métriques d'engagement
   - Ajustements UX

## Notes de développement

- Toujours tester sur tablette (appareil principal de l'enfant)
- Maintenir la compatibilité avec l'existant pendant la migration
- Documenter les changements pour faciliter la maintenance
- Utiliser les analytics pour guider les décisions

## Support

Pour toute question ou problème :
- Issues GitHub : https://github.com/sirensnake/lemondedescurieux/issues
- Documentation Vite : https://vitejs.dev/
- Documentation Alpine.js : https://alpinejs.dev/