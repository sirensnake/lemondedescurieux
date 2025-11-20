# ⚡ Actions Rapides - Correction Encodage

## 🎯 Commandes à Copier-Coller dans Terminal Linux

```bash
# 1. Navigation
cd /media/siren_snake/T7/01_Projets_Dev/lemondedescurieux/diagnostic_encoding

# 2. Permissions
chmod +x *.sh *.py

# 3. Installation dépendance Python (si pas déjà installé)
pip3 install chardet --user

# 4. AUDIT - Identifier les problèmes
python3 audit_encoding.py

# 5. Examiner le rapport
cat rapport_encodage.txt | less
# Appuyez sur 'q' pour quitter

# 6. TEST CORRECTION (sans modification)
python3 fix_encoding.py

# 7. Examiner corrections proposées
cat rapport_correction_test.txt | less

# 8. CORRECTION RÉELLE (si test OK)
python3 fix_encoding.py --fix

# 9. Vérifier résultats
cat rapport_correction.txt

# 10. Tester dans navigateur
cd ..
firefox index.html  # ou chromium-browser index.html

# 11. Si OK, commit
git add .
git commit -m "fix: correction encodage UTF-8 - accents français"
git push origin main
```

## ⏱️ Temps Estimé : 15-30 minutes

---

## 🆘 Dépannage Rapide

### Erreur "chardet not found"
```bash
pip3 install chardet --user
```

### Erreur "permission denied"
```bash
chmod +x *.sh *.py
```

### Caractères toujours corrompus après correction
```bash
# Restaurer depuis backup
cp backups/nom_fichier_TIMESTAMP.html nom_fichier.html

# Vérifier encodage VSCode
# File > Preferences > Settings > Search "files.encoding"
# Doit être : utf8
```

---

## 📋 Checklist Validation

- [ ] Audit exécuté sans erreur
- [ ] Rapport généré et lisible
- [ ] Nombre de fichiers affectés identifié
- [ ] Test correction (dry-run) effectué
- [ ] Corrections proposées cohérentes
- [ ] Correction réelle appliquée (`--fix`)
- [ ] Backups créés automatiquement
- [ ] Site testé localement dans navigateur
- [ ] Accents français affichés correctement
- [ ] Commit et push effectués

---

## 🎯 Résultat Attendu

**Avant** :
```
❌ Explorez les diff├®rentes le├ºons
❌ bienvenue sur la plan├¿te anglophone
```

**Après** :
```
✅ Explorez les différentes leçons
✅ bienvenue sur la planète anglophone
```

---

## 📞 Prochaine Action avec Claude

Après avoir exécuté ces commandes, copiez-collez dans Claude :
1. Le contenu de `rapport_encodage.txt`
2. Le contenu de `rapport_correction.txt`
3. Confirmation visuelle que les accents s'affichent correctement dans le navigateur

Claude ajustera alors la stratégie pour les prochaines étapes du projet.
