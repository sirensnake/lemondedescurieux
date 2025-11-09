/**
 * Script pour ajouter la référence au CSS du fil d'Ariane à toutes les pages HTML
 * 
 * Usage: 
 * 1. Installez Node.js si ce n'est pas déjà fait
 * 2. Sauvegardez ce script en tant que add-breadcrumb-css.js à la racine de votre projet
 * 3. Exécutez la commande: node add-breadcrumb-css.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = './'; // Répertoire racine du projet
const cssLinkToAdd = '<link rel="stylesheet" href="styles/breadcrumb.css">';
const filesToExclude = ['.git', 'node_modules']; // Dossiers à ignorer

// Compteurs pour les statistiques
let filesProcessed = 0;
let filesModified = 0;
let filesAlreadyHaveCss = 0;
let filesWithErrors = 0;

/**
 * Vérifie si un fichier HTML contient déjà la référence au CSS du fil d'Ariane
 * @param {string} content - Contenu du fichier HTML
 * @returns {boolean} - True si la référence existe déjà
 */
function hasBreadcrumbCssLink(content) {
    return content.includes('href="styles/breadcrumb.css"') || 
           content.includes("href='styles/breadcrumb.css'");
}

/**
 * Ajoute la référence au CSS du fil d'Ariane dans la section head d'un fichier HTML
 * @param {string} content - Contenu du fichier HTML
 * @returns {string} - Contenu modifié
 */
function addCssLink(content) {
    // Recherche la fin de la section head
    const headEndIndex = content.indexOf('</head>');
    
    if (headEndIndex === -1) {
        console.error('  ⚠️ Section </head> non trouvée');
        return null;
    }
    
    // Trouve la position d'insertion avant </head>
    const insertPosition = content.lastIndexOf('</head>');
    
    // Insère la référence CSS avec une indentation de 2 espaces
    return content.substring(0, insertPosition) + 
           '  ' + cssLinkToAdd + '\n  ' + 
           content.substring(insertPosition);
}

/**
 * Parcourt récursivement un répertoire pour traiter tous les fichiers HTML
 * @param {string} dir - Chemin du répertoire à parcourir
 */
function processDirectory(dir) {
    // Liste tous les fichiers et dossiers
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        // Construit le chemin complet
        const itemPath = path.join(dir, item);
        
        // Vérifie si c'est un dossier à exclure
        if (filesToExclude.some(exclude => itemPath.includes(exclude))) {
            continue;
        }
        
        // Récupère les informations sur l'élément
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
            // Si c'est un dossier, traite-le récursivement
            processDirectory(itemPath);
        } else if (stats.isFile() && item.endsWith('.html')) {
            // Si c'est un fichier HTML, traite-le
            processHtmlFile(itemPath);
        }
    }
}

/**
 * Traite un fichier HTML pour ajouter la référence CSS si nécessaire
 * @param {string} filePath - Chemin du fichier HTML à traiter
 */
function processHtmlFile(filePath) {
    try {
        console.log(`Traitement de ${filePath}`);
        filesProcessed++;
        
        // Lit le contenu du fichier
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifie si la référence existe déjà
        if (hasBreadcrumbCssLink(content)) {
            console.log(`  ✓ CSS du fil d'Ariane déjà présent`);
            filesAlreadyHaveCss++;
            return;
        }
        
        // Ajoute la référence CSS
        const modifiedContent = addCssLink(content);
        
        if (modifiedContent === null) {
            filesWithErrors++;
            return;
        }
        
        // Sauvegarde le fichier modifié
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
        console.log(`  ✓ CSS du fil d'Ariane ajouté`);
        filesModified++;
        
    } catch (error) {
        console.error(`  ❌ Erreur lors du traitement de ${filePath}:`, error.message);
        filesWithErrors++;
    }
}

// Point d'entrée principal
console.log('=== Ajout du CSS du fil d\'Ariane à tous les fichiers HTML ===');
console.log(`CSS à ajouter: "${cssLinkToAdd}"\n`);

// Exécute le traitement
try {
    processDirectory(rootDir);
    
    // Affiche les statistiques
    console.log('\n=== Résumé ===');
    console.log(`Fichiers HTML traités: ${filesProcessed}`);
    console.log(`Fichiers modifiés: ${filesModified}`);
    console.log(`Fichiers déjà à jour: ${filesAlreadyHaveCss}`);
    console.log(`Fichiers avec erreurs: ${filesWithErrors}`);
    console.log('\nTraitement terminé!');
    
} catch (error) {
    console.error('Erreur globale:', error.message);
}