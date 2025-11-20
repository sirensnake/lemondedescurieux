#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de correction encodage - Le Monde des Curieux
Corrige automatiquement les problèmes d'encodage UTF-8
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

# Table de correction exhaustive
CORRECTION_TABLE = {
    # Accents courants
    '├®': 'é',
    '├¿': 'è',
    '├á': 'à',
    '├¬': 'ê',
    '├®': 'é',
    '├¼': 'ç',
    '├´': 'ô',
    '├¨': 'î',
    '├╣': 'ù',
    '├»': 'û',
    '├»': 'û',
    
    # Apostrophes et guillemets
    'â': "'",
    'â': "'",
    'Ã': 'à',
    'Â': '',  # Caractère invisible parasite
    
    # Caractères spéciaux
    'â¢': '•',
    'â': '—',
    'â¦': '…',
    
    # Majuscules accentuées
    '├ë': 'É',
    '├ê': 'È',
    '├Ç': 'À',
}

def create_backup(filepath):
    """Crée une sauvegarde du fichier original"""
    backup_dir = filepath.parent / 'backups'
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_name = f"{filepath.stem}_{timestamp}{filepath.suffix}"
    backup_path = backup_dir / backup_name
    
    shutil.copy2(filepath, backup_path)
    return backup_path

def fix_file_encoding(filepath, dry_run=False):
    """Corrige l'encodage d'un fichier"""
    corrections = []
    
    try:
        # Lire le fichier
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Appliquer les corrections
        original_content = content
        for corrupt, correct in CORRECTION_TABLE.items():
            if corrupt in content:
                count = content.count(corrupt)
                content = content.replace(corrupt, correct)
                corrections.append({
                    'from': corrupt,
                    'to': correct,
                    'count': count
                })
        
        # Si modifications et pas en mode test
        if corrections and not dry_run:
            # Créer backup
            backup_path = create_backup(filepath)
            
            # Écrire fichier corrigé
            with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
                f.write(content)
            
            return {
                'success': True,
                'corrections': corrections,
                'backup': str(backup_path)
            }
        elif corrections:
            return {
                'success': False,
                'dry_run': True,
                'corrections': corrections
            }
        else:
            return {
                'success': True,
                'no_changes': True
            }
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def fix_project(root_path, extensions=['.html', '.js', '.css', '.md'], dry_run=False):
    """Corrige tous les fichiers du projet"""
    results = {
        'summary': {
            'total_files': 0,
            'files_fixed': 0,
            'files_with_errors': 0,
            'total_corrections': 0
        },
        'files': []
    }
    
    root = Path(root_path)
    mode = "🔍 TEST (DRY RUN)" if dry_run else "✏️ CORRECTION RÉELLE"
    
    print(f"\n{mode}")
    print("=" * 80)
    
    for ext in extensions:
        for filepath in root.rglob(f'*{ext}'):
            # Ignorer certains dossiers
            if any(x in str(filepath) for x in ['node_modules', '.git', 'diagnostic_encoding', 'backups']):
                continue
            
            results['summary']['total_files'] += 1
            
            # Appliquer corrections
            fix_result = fix_file_encoding(filepath, dry_run=dry_run)
            
            if fix_result.get('success'):
                if fix_result.get('corrections'):
                    results['summary']['files_fixed'] += 1
                    results['summary']['total_corrections'] += sum(
                        c['count'] for c in fix_result['corrections']
                    )
                    
                    results['files'].append({
                        'path': str(filepath.relative_to(root)),
                        'corrections': fix_result['corrections'],
                        'backup': fix_result.get('backup')
                    })
                    
                    print(f"\n✅ {filepath.relative_to(root)}")
                    for correction in fix_result['corrections']:
                        print(f"   '{correction['from']}' → '{correction['to']}' ({correction['count']} fois)")
            else:
                if not fix_result.get('no_changes'):
                    results['summary']['files_with_errors'] += 1
                    results['files'].append({
                        'path': str(filepath.relative_to(root)),
                        'error': fix_result.get('error', 'Unknown error')
                    })
                    print(f"\n❌ {filepath.relative_to(root)}")
                    print(f"   Erreur : {fix_result.get('error')}")
    
    return results

def generate_fix_report(results, output_path, dry_run=False):
    """Génère un rapport de correction"""
    mode = "TEST (DRY RUN)" if dry_run else "CORRECTION RÉELLE"
    
    report_lines = [
        "=" * 80,
        f"RAPPORT DE CORRECTION ENCODAGE - {mode}",
        "=" * 80,
        "",
        "📊 RÉSUMÉ",
        f"Fichiers scannés : {results['summary']['total_files']}",
        f"Fichiers corrigés : {results['summary']['files_fixed']}",
        f"Total corrections : {results['summary']['total_corrections']}",
        f"Erreurs : {results['summary']['files_with_errors']}",
        "",
    ]
    
    if not dry_run:
        report_lines.extend([
            "⚠️  BACKUPS CRÉÉS",
            "Tous les fichiers originaux ont été sauvegardés dans des dossiers 'backups/'",
            ""
        ])
    
    report_lines.extend([
        "=" * 80,
        "📝 DÉTAILS",
        "=" * 80,
        ""
    ])
    
    for file_info in results['files']:
        if 'error' in file_info:
            report_lines.extend([
                f"\n❌ {file_info['path']}",
                f"   Erreur : {file_info['error']}",
                ""
            ])
        else:
            report_lines.extend([
                f"\n✅ {file_info['path']}",
            ])
            if 'backup' in file_info:
                report_lines.append(f"   Backup : {file_info['backup']}")
            for correction in file_info.get('corrections', []):
                report_lines.append(
                    f"   '{correction['from']}' → '{correction['to']}' ({correction['count']} fois)"
                )
            report_lines.append("")
    
    # Sauvegarder rapport
    report_name = 'rapport_correction_test.txt' if dry_run else 'rapport_correction.txt'
    report_path = output_path / report_name
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))
    
    print('\n'.join(report_lines))
    print(f"\n✅ Rapport sauvegardé : {report_path}")

if __name__ == '__main__':
    import sys
    
    # Chemin du projet
    project_root = Path(__file__).parent.parent
    output_dir = Path(__file__).parent
    
    # Mode dry-run par défaut
    dry_run = '--fix' not in sys.argv
    
    if dry_run:
        print("\n🔍 MODE TEST (DRY RUN)")
        print("Aucune modification ne sera effectuée.")
        print("Pour appliquer les corrections, relancez avec : python fix_encoding.py --fix")
    else:
        print("\n⚠️  MODE CORRECTION RÉELLE")
        print("Les fichiers vont être modifiés (backups créés automatiquement)")
        response = input("\nContinuer ? (oui/non) : ")
        if response.lower() not in ['oui', 'o', 'yes', 'y']:
            print("Annulé.")
            sys.exit(0)
    
    print(f"\n📂 Projet : {project_root}")
    print(f"📊 Rapport : {output_dir}")
    
    # Lancer la correction
    results = fix_project(project_root, dry_run=dry_run)
    
    # Générer le rapport
    generate_fix_report(results, output_dir, dry_run=dry_run)
    
    if dry_run:
        print("\n💡 Pour appliquer les corrections, relancez avec : python fix_encoding.py --fix")
    else:
        print("\n✅ Correction terminée !")
        print("⚠️  Vérifiez les fichiers et testez le site avant de commit.")
