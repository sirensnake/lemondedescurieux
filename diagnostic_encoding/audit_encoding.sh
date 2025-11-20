#!/bin/bash
# Script d'audit encodage simplifié (bash pur)
# Détecte les caractères corrompus dans les fichiers du projet

PROJECT_ROOT="/media/siren_snake/T7/01_Projets_Dev/lemondedescurieux"
OUTPUT_DIR="$PROJECT_ROOT/diagnostic_encoding"
REPORT_FILE="$OUTPUT_DIR/rapport_encodage_bash.txt"

# Caractères problématiques à rechercher (en hexadécimal)
CORRUPT_CHARS=(
    "├®"  # Should be é
    "├¿"  # Should be è  
    "├á"  # Should be à
    "├¬"  # Should be ê
    "├¼"  # Should be ç
    "├´"  # Should be ô
    "├¨"  # Should be î
    "├╣"  # Should be ù
    "├»"  # Should be û
    "â"   # Should be '
    "â¢"  # Should be •
)

echo "🔍 Audit d'encodage - Le Monde des Curieux" > "$REPORT_FILE"
echo "========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "📅 Date : $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "📂 Projet : $PROJECT_ROOT" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

total_files=0
files_with_issues=0
total_issues=0

# Extensions à scanner
EXTENSIONS=("html" "js" "css" "md")

echo "🔍 Scan des fichiers..."
echo "========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

for ext in "${EXTENSIONS[@]}"; do
    echo "📄 Scanning *.$ext files..."
    
    while IFS= read -r -d '' file; do
        # Ignorer certains dossiers
        if [[ "$file" == *"/node_modules/"* ]] || \
           [[ "$file" == *"/.git/"* ]] || \
           [[ "$file" == *"/diagnostic_encoding/"* ]] || \
           [[ "$file" == *"/backups/"* ]]; then
            continue
        fi
        
        ((total_files++))
        file_has_issues=false
        file_issues=0
        
        # Créer un buffer pour ce fichier
        file_report=""
        
        # Chercher chaque caractère corrompu
        for corrupt_char in "${CORRUPT_CHARS[@]}"; do
            if grep -q "$corrupt_char" "$file" 2>/dev/null; then
                if [ "$file_has_issues" = false ]; then
                    file_has_issues=true
                    ((files_with_issues++))
                    relative_path="${file#$PROJECT_ROOT/}"
                    file_report+="\n📄 $relative_path\n"
                fi
                
                count=$(grep -o "$corrupt_char" "$file" 2>/dev/null | wc -l)
                ((file_issues += count))
                ((total_issues += count))
                
                # Trouver les lignes avec contexte
                while IFS= read -r line_info; do
                    line_num=$(echo "$line_info" | cut -d: -f1)
                    line_content=$(echo "$line_info" | cut -d: -f2-)
                    # Limiter le contexte à 80 caractères
                    context=$(echo "$line_content" | cut -c1-80)
                    file_report+="   ❌ Ligne $line_num : contient '$corrupt_char'\n"
                    file_report+="      Contexte : $context\n"
                done < <(grep -n "$corrupt_char" "$file" 2>/dev/null | head -5)
                
                file_report+="\n"
            fi
        done
        
        # Écrire le rapport du fichier s'il y a des problèmes
        if [ "$file_has_issues" = true ]; then
            echo -e "$file_report" >> "$REPORT_FILE"
        fi
        
    done < <(find "$PROJECT_ROOT" -type f -name "*.$ext" -print0 2>/dev/null)
done

# Résumé
{
    echo ""
    echo "========================================" 
    echo "📊 RÉSUMÉ" 
    echo "========================================"
    echo ""
    echo "Total fichiers scannés : $total_files"
    echo "Fichiers avec problèmes : $files_with_issues"
    echo "Total problèmes détectés : $total_issues"
    echo ""
} >> "$REPORT_FILE"

# Afficher également à l'écran
cat "$REPORT_FILE"

echo ""
echo "✅ Rapport sauvegardé : $REPORT_FILE"
echo ""

if [ $files_with_issues -gt 0 ]; then
    echo "⚠️  $files_with_issues fichier(s) nécessitent une correction"
    echo "💡 Utilisez le script fix_encoding.py pour corriger automatiquement"
else
    echo "✅ Aucun problème d'encodage détecté !"
fi
