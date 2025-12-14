#!/bin/bash

# Script d'intégration du menu latéral unifié
# Le Monde des Curieux - Décembre 2024

SECTIONS=(
    "francais_duolingo_section.html"
    "maths_duolingo_section.html"
    "english_duolingo_section.html"
    "sciences_duolingo_section.html"
    "histoire_duolingo_section.html"
    "programmation_duolingo_section.html"
)

echo "🚀 Intégration du menu latéral unifié..."
echo ""

for section in "${SECTIONS[@]}"; do
    echo "📄 Traitement de $section..."
    
    # Backup
    cp "$section" "${section}.backup_avant_menu"
    
    # 1. Ajouter le CSS du menu dans le <head> (avant </head>)
    sed -i '/<\/head>/i \    <link rel="stylesheet" href="styles/side-menu-unified.css">' "$section"
    
    # 2. Ajouter le bouton hamburger juste après <body>
    sed -i '/<body/a \    <!-- Bouton Menu Hamburger -->\n    <button class="menu-toggle-btn" onclick="toggleSideMenu()" aria-label="Ouvrir le menu">\n        ☰\n    </button>' "$section"
    
    # 3. Ajouter les scripts avant </body>
    sed -i '/<\/body>/i \    <!-- Menu Latéral Unifié -->\n    <script src="scripts/side-menu-unified.js"><\/script>\n    <script>\n        // Charger le menu automatiquement\n        document.addEventListener("DOMContentLoaded", () => {\n            loadSideMenu();\n        });\n    <\/script>' "$section"
    
    echo "   ✅ $section modifié"
done

echo ""
echo "🎉 Intégration terminée pour ${#SECTIONS[@]} sections !"
echo "📦 Backups créés : *.backup_avant_menu"
