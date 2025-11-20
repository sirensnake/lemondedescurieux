# 🔧 Outils de Diagnostic et Correction Encodage

## 📋 Vue d'ensemble

Ces scripts Python permettent d'identifier et corriger automatiquement les problèmes d'encodage UTF-8 dans le projet "Le Monde des Curieux".

**Problème typique identifié** :
```
❌ "Explorez les diff├®rentes le├ºons"
✅ Devrait être : "Explorez les différentes leçons"
```

## 🚀 Utilisation

### Étape 1 : Audit (Diagnostic)

Lance l'audit pour identifier tous les problèmes d'encodage :

```bash
cd /media/siren_snake/T7/01_Projets_Dev/lemondedescurieux/diagnostic_encoding
python3 audit_encoding.py
```

**Résultats générés** :
- `rapport_encodage.txt` : Rapport lisible détaillé
- `rapport_encodage.json` : Données structurées pour analyse

### Étape 2 : Test de Correction (Dry Run)

Teste les corrections SANS modifier les fichiers :

```bash
python3 fix_encoding.py
```

**Ce que fait le script** :
- ✅ Analyse tous les fichiers `.html`, `.js`, `.css`, `.md`
- ✅ Identifie les caractères corrompus
- ✅ Affiche les corrections qui seraient appliquées
- ❌ **Ne modifie aucun fichier** (mode test sécurisé)

### Étape 3 : Correction Réelle

Applique les corrections avec sauvegarde automatique :

```bash
python3 fix_encoding.py --fix
```

**Sécurités intégrées** :
- ✅ Demande confirmation avant modification
- ✅ Crée des backups automatiques dans `backups/`
- ✅ Génère un rapport détaillé des modifications
- ✅ Possibilité de rollback manuel via les backups

## 📊 Table de Correction

Le script corrige automatiquement :

| Caractère Corrompu | Caractère Correct | Description |
|-------------------|-------------------|-------------|
| `├®` | `é` | e accent aigu |
| `├¿` | `è` | e accent grave |
| `├á` | `à` | a accent grave |
| `├¬` | `ê` | e circonflexe |
| `├¼` | `ç` | c cédille |
| `├´` | `ô` | o circonflexe |
| `├¨` | `î` | i circonflexe |
| `├╣` | `ù` | u accent grave |
| `├»` | `û` | u circonflexe |
| `â` | `'` | apostrophe |
| `â¢` | `•` | puce |

## 🔍 Exemples de Rapports

### Rapport d'Audit
```
================================================================================
AUDIT ENCODAGE - LE MONDE DES CURIEUX
================================================================================

📊 RÉSUMÉ
Total fichiers scannés : 45
Fichiers avec problèmes : 12
Total problèmes détectés : 87

================================================================================
📝 DÉTAILS PAR FICHIER
================================================================================

📄 english_duolingo_section.html
   Encodage détecté : utf-8 (confiance: 99.00%)
   Problèmes trouvés : 8

   ❌ Ligne 42 : '├®' → devrait être 'é'
      Contexte : <h2>Explorez les diff├®rentes le├ºons</h2>
```

### Rapport de Correction
```
================================================================================
RAPPORT DE CORRECTION ENCODAGE - CORRECTION RÉELLE
================================================================================

📊 RÉSUMÉ
Fichiers scannés : 45
Fichiers corrigés : 12
Total corrections : 87
Erreurs : 0

⚠️  BACKUPS CRÉÉS
Tous les fichiers originaux ont été sauvegardés dans des dossiers 'backups/'

================================================================================
📝 DÉTAILS
================================================================================

✅ english_duolingo_section.html
   Backup : backups/english_duolingo_section_20251119_143022.html
   '├®' → 'é' (5 fois)
   '├¿' → 'è' (2 fois)
   '├¼' → 'ç' (1 fois)
```

## 🛡️ Sécurité et Rollback

### En cas de problème après correction

1. **Identifier le backup** :
```bash
ls -la backups/
```

2. **Restaurer un fichier spécifique** :
```bash
cp backups/english_duolingo_section_20251119_143022.html english_duolingo_section.html
```

3. **Restaurer tous les fichiers** :
```bash
find backups/ -name "*.html" -exec sh -c 'cp "$1" "${1#backups/}"' _ {} \;
```

## 🎯 Workflow Recommandé

### Première Utilisation

```bash
# 1. Audit complet
python3 audit_encoding.py

# 2. Examiner le rapport
cat rapport_encodage.txt

# 3. Test sans modification
python3 fix_encoding.py

# 4. Examiner les corrections proposées
cat rapport_correction_test.txt

# 5. Appliquer les corrections
python3 fix_encoding.py --fix

# 6. Vérifier les résultats
cat rapport_correction.txt

# 7. Tester le site localement
# Ouvrir index.html dans le navigateur

# 8. Si OK, commit
git add .
git commit -m "fix: correction encodage UTF-8 automatique"
git push
```

### Utilisation Régulière

```bash
# Audit rapide périodique
python3 audit_encoding.py && cat rapport_encodage.txt | grep "Problèmes trouvés"
```

## 📝 Notes Techniques

### Dépendances Python

Le script nécessite le module `chardet` :

```bash
pip install chardet
```

### Extensions Traitées

Par défaut :
- `.html` : Pages web
- `.js` : Scripts JavaScript
- `.css` : Feuilles de style
- `.md` : Documentation Markdown

### Dossiers Ignorés

- `node_modules/`
- `.git/`
- `diagnostic_encoding/`
- `backups/`

## 🐛 Résolution de Problèmes

### "Module chardet not found"
```bash
pip install --user chardet
# ou
pip3 install --user chardet
```

### "Permission denied"
```bash
chmod +x audit_encoding.py fix_encoding.py
```

### Caractères toujours corrompus après correction

**Cause probable** : Les fichiers sources originaux contenaient déjà les caractères corrompus

**Solution** :
1. Vérifier l'encodage de votre éditeur (doit être UTF-8)
2. Dans VSCode : File > Preferences > Settings > Search "encoding"
3. Définir `files.encoding: utf8`
4. Rééditer manuellement les fichiers si nécessaire

## 🎯 Résultats Attendus

Après correction, les pages HTML devraient afficher :
- ✅ "différentes leçons" au lieu de "diff├®rentes le├ºons"
- ✅ "planète anglophone" au lieu de "plan├¿te anglophone"
- ✅ "Français" au lieu de "Fran├ºais"
- ✅ Tous les accents français correctement rendus

## 📧 Support

En cas de problème, consulter :
1. Les rapports générés (`rapport_*.txt`)
2. Les backups créés dans `backups/`
3. La documentation du projet principal

---

**Version** : 1.0  
**Auteur** : Curio Expert  
**Date** : 19/11/2025
