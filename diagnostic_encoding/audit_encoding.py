#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script d'audit encodage - Le Monde des Curieux
Identifie précisément les problèmes d'encodage UTF-8
"""

import os
import sys
import chardet
from pathlib import Path
import json

# Caractères problématiques détectés
PROBLEMATIC_CHARS = {
    '├®': 'é',
    '├¿': 'è',
    '├á': 'à',
    '├¬': 'ê',
    '├¼': 'ç',
    'â': "'",
    'â¢': '•',
}

def detect_file_encoding(filepath):
    """Détecte l'encodage réel d'un fichier"""
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()
            result = chardet.detect(raw_data)
            return result
    except Exception as e:
        return {'encoding': 'ERROR', 'confidence': 0, 'error': str(e)}

def scan_file_content(filepath, encoding='utf-8'):
    """Scanne le contenu d'un fichier à la recherche de caractères corrompus"""
    issues = []
    try:
        with open(filepath, 'r', encoding=encoding, errors='replace') as f:
            lines = f.readlines()
            
        for line_num, line in enumerate(lines, 1):
            for corrupt, correct in PROBLEMATIC_CHARS.items():
                if corrupt in line:
                    issues.append({
                        'line': line_num,
                        'corrupt_char': corrupt,
                        'expected_char': correct,
                        'context': line.strip()[:100]  # 100 premiers caractères
                    })
    except Exception as e:
        issues.append({'error': str(e)})
    
    return issues

def audit_project(root_path, extensions=['.html', '.js', '.css', '.md']):
    """Audit complet du projet"""
    results = {
        'summary': {
            'total_files': 0,
            'files_with_issues': 0,
            'total_issues': 0
        },
        'files': []
    }
    
    root = Path(root_path)
    
    # Parcourir tous les fichiers
    for ext in extensions:
        for filepath in root.rglob(f'*{ext}'):
            # Ignorer certains dossiers
            if any(x in str(filepath) for x in ['node_modules', '.git', 'diagnostic_encoding']):
                continue
            
            results['summary']['total_files'] += 1
            
            # Détecter encodage
            encoding_info = detect_file_encoding(filepath)
            
            # Scanner contenu
            issues = scan_file_content(filepath, encoding_info.get('encoding', 'utf-8'))
            
            if issues:
                results['summary']['files_with_issues'] += 1
                results['summary']['total_issues'] += len(issues)
                
                results['files'].append({
                    'path': str(filepath.relative_to(root)),
                    'encoding_detected': encoding_info.get('encoding'),
                    'encoding_confidence': encoding_info.get('confidence'),
                    'issues_count': len(issues),
                    'issues': issues[:10]  # Limiter à 10 premiers problèmes
                })
    
    return results

def generate_report(results, output_path):
    """Génère un rapport détaillé"""
    report_lines = [
        "=" * 80,
        "AUDIT ENCODAGE - LE MONDE DES CURIEUX",
        "=" * 80,
        "",
        "📊 RÉSUMÉ",
        f"Total fichiers scannés : {results['summary']['total_files']}",
        f"Fichiers avec problèmes : {results['summary']['files_with_issues']}",
        f"Total problèmes détectés : {results['summary']['total_issues']}",
        "",
        "=" * 80,
        "📝 DÉTAILS PAR FICHIER",
        "=" * 80,
        ""
    ]
    
    for file_info in results['files']:
        report_lines.extend([
            f"\n📄 {file_info['path']}",
            f"   Encodage détecté : {file_info['encoding_detected']} (confiance: {file_info['encoding_confidence']:.2%})",
            f"   Problèmes trouvés : {file_info['issues_count']}",
            ""
        ])
        
        for issue in file_info['issues']:
            if 'error' in issue:
                report_lines.append(f"   ❌ ERREUR : {issue['error']}")
            else:
                report_lines.extend([
                    f"   ❌ Ligne {issue['line']} : '{issue['corrupt_char']}' → devrait être '{issue['expected_char']}'",
                    f"      Contexte : {issue['context']}",
                    ""
                ])
    
    # Sauvegarder rapport texte
    txt_path = output_path / 'rapport_encodage.txt'
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))
    
    # Sauvegarder JSON complet
    json_path = output_path / 'rapport_encodage.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print('\n'.join(report_lines))
    print(f"\n✅ Rapports sauvegardés :")
    print(f"   📄 {txt_path}")
    print(f"   📄 {json_path}")

if __name__ == '__main__':
    # Chemin du projet
    project_root = Path(__file__).parent.parent
    output_dir = Path(__file__).parent
    
    print("🔍 Démarrage de l'audit encodage...")
    print(f"📂 Projet : {project_root}")
    print(f"📊 Rapport : {output_dir}")
    print()
    
    # Lancer l'audit
    results = audit_project(project_root)
    
    # Générer le rapport
    generate_report(results, output_dir)
    
    print("\n✅ Audit terminé !")
