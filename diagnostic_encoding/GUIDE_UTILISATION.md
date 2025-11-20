# 🎯 GUIDE D'UTILISATION - Scripts de Diagnostic Encodage

## ⚠️ Important : Exécution depuis votre terminal Linux

Les scripts ne peuvent pas être exécutés depuis l'interface Claude car ils nécessitent l'accès complet à votre système de fichiers.

## 📋 Étapes à Suivre

### 1. Ouvrir un Terminal Linux

Appuyez sur `Ctrl+Alt+T` ou ouvrez votre terminal préféré.

### 2. Naviguer vers le Projet

```bash
cd /media/siren_snake/T7/01_Projets_Dev/lemondedescurieux/diagnostic_encoding
```

### 3. Rendre les Scripts Exécutables

```bash
chmod +x audit_encoding.sh audit_encoding.py fix_encoding.py
```

### 4. Lancer l'Audit (Version Bash - Simple)

```bash
./audit_encoding.sh
```

**OU** Version Python (Plus Détaillée - Nécessite chardet) :

```bash
# Installer chardet si nécessaire
pip3 install chardet --user

# Lancer l'audit Python
python3 audit_encoding.py
```

### 5. Examiner le Rapport

```bash
cat rapport_encodage_bash.txt
# OU
cat rapport_encodage.txt  # Si vous avez utilisé Python
```

### 6. Tester la Correction (Sans Modifier les Fichiers)

```bash
python3 fix_encoding.py
```

### 7. Appliquer la Correction Réelle

```bash
python3 fix_encoding.py --fix
```

## 🎯 Workflow Complet Recommandé

```bash
# Terminal Linux - Copier-coller ces commandes

cd /media/siren_snake/T7/01_Projets_Dev/lemondedescurieux/diagnostic_encoding

# Rendre exécutables
chmod +x *.sh *.py

# Audit rapide bash
./audit_encoding.sh

# Si vous préférez Python (plus précis)
pip3 install chardet --user
python3 audit_encoding.py

# Examiner les résultats
less rapport_encodage_bash.txt  # ou rapport_encodage.txt

# Test de correction (mode dry-run sécurisé)
python3 fix_encoding.py

# Si les corrections semblent bonnes, appliquer
python3 fix_encoding.py --fix

# Vérifier les résultats
cat rapport_correction.txt

# Tester le site localement
cd ..
firefox index.html  # ou chromium-browser index.html
```

## 📊 Que Faire Avec les Résultats

### Si le rapport montre des problèmes :

1. **Examinez le rapport** : Identifiez quels fichiers sont affectés
2. **Testez la correction** : `python3 fix_encoding.py` (mode test)
3. **Appliquez si OK** : `python3 fix_encoding.py --fix`
4. **Vérifiez dans le navigateur** : Ouvrez `index.html` localement
5. **Si OK, commitez** :
   ```bash
   cd ..
   git add .
   git commit -m "fix: correction automatique encodage UTF-8"
   git push origin main
   ```

### Si le rapport ne montre aucun problème :

Le problème pourrait être ailleurs :
- Vérifiez l'encodage de VSCode : `File > Preferences > Settings > files.encoding`
- Vérifiez les métadonnées Git : `git config --global core.quotepath false`
- Le problème pourrait être dans les images SVG ou autres fichiers binaires

## 🆘 En Cas de Problème

### "Module chardet not found"
```bash
pip3 install chardet --user
```

### "Permission denied"
```bash
chmod +x audit_encoding.sh audit_encoding.py fix_encoding.py
```

### Caractères toujours corrompus après correction

1. Vérifiez l'encodage de votre éditeur (UTF-8)
2. Examinez les backups créés dans `backups/`
3. Restaurez manuellement si nécessaire
4. Revenez vers Claude avec les résultats du rapport

## 📝 Commandes de Diagnostic Supplémentaires

```bash
# Vérifier l'encodage d'un fichier spécifique
file -bi english_duolingo_section.html

# Chercher manuellement des caractères corrompus
grep -n "├" ../english_duolingo_section.html

# Lister tous les fichiers avec problèmes
find .. -name "*.html" -exec grep -l "├" {} \;

# Vérifier la configuration Git
git config --list | grep core
```

## 🎯 Prochaines Actions

Après avoir exécuté ces commandes dans votre terminal Linux :

1. **Copiez le contenu du rapport** (`rapport_encodage_bash.txt` ou `rapport_encodage.txt`)
2. **Collez-le dans Claude** pour que je puisse analyser les problèmes spécifiques
3. **Nous ajusterons ensemble** la stratégie de correction si nécessaire

---

**Note** : Ces scripts ont été créés pour être sûrs et réversibles. Tous les fichiers modifiés sont automatiquement sauvegardés dans `backups/` avant toute modification.
