# Règles de Développement - Le Monde des Curieux

## Architecture CSS/JS

### ❌ INTERDIT
- CSS inline dans les balises `<style>`
- JavaScript inline dans les balises `<script>` (sauf 1-2 lignes max)
- Styles inline `style="..."`

### ✅ OBLIGATOIRE
- Tout CSS dans fichiers externes `styles/*.css`
- Tout JavaScript dans fichiers externes `scripts/*.js`
- Liens via `<link rel="stylesheet">` et `<script src="">`

### Exceptions autorisées
- Fonts externes (Google Fonts) → `<link>` dans `<head>`
- Scripts CDN essentiels (Alpine.js, Chart.js) → `<script src="">` depuis CDN

## Structure Standard
```
lemondedescurieux/
├── index.html              (HTML pur, pas de CSS/JS inline)
├── styles/
│   ├── style.css          (styles globaux)
│   ├── mindmap.css        (page d'accueil)
│   └── section.css        (sections éducatives)
├── scripts/
│   ├── mindmap.js         (page d'accueil)
│   ├── xp_system.js       (gamification)
│   └── section.js         (sections)
└── images/
    └── MDC_Mindmap.png
```

## Priorités Techniques

1. **Séparation stricte** HTML/CSS/JS
2. **Modularité** : fichiers réutilisables
3. **Performance** : minification en production
4. **Maintenabilité** : code organisé et documenté