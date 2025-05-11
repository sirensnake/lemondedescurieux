/**
 * Script pour ajouter un fil d'Ariane standardisé à toutes les pages HTML
 * 
 * Usage: 
 * 1. Installez Node.js si ce n'est pas déjà fait
 * 2. Sauvegardez ce script en tant que add-breadcrumb.js à la racine de votre projet
 * 3. Exécutez la commande: node add-breadcrumb.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = './'; // Répertoire racine du projet
const filesToExclude = ['.git', 'node_modules']; // Dossiers à ignorer
const excludeFiles = ['index.html']; // Fichiers spécifiques à ignorer

// Structure des sections avec leurs emoji et chemins de fichiers
const sections = {
    'maths': { emoji: '🔢', title: 'Mathématiques', pattern: /maths/i },
    'sciences': { emoji: '🔬', title: 'Sciences', pattern: /sciences/i },
    'histoire': { emoji: '📜', title: 'Histoire', pattern: /histoire/i },
    'geographie': { emoji: '🌍', title: 'Géographie', pattern: /geo|carte/i },
    'francais': { emoji: '📝', title: 'Français', pattern: /francais/i },
    'english': { emoji: '🇬🇧', title: 'English', pattern: /english/i },
    'programmation': { emoji: '💻', title: 'Programmation', pattern: /prog/i },
    'echecs': { emoji: '♟️', title: 'Échecs', pattern: /echecs/i },
    'philosophie': { emoji: '🧠', title: 'Philosophie', pattern: /philo/i },
    'ia': { emoji: '🤖', title: 'Intelligence Artificielle', pattern: /ia|intelligence/i },
    'ressources': { emoji: '📚', title: 'Ressources', pattern: /ressources/i },
    'infos': { emoji: 'ℹ️', title: 'Infos', pattern: /infos/i }
};

// Compteurs pour les statistiques
let filesProcessed = 0;
let filesModified = 0;
let filesSkipped = 0;
let filesWithErrors = 0;

/**
 * Détermine la section d'une page à partir de son nom de fichier
 * @param {string} filename - Nom du fichier
 * @returns {Object|null} - Informations sur la section ou null si non trouvé
 */
function determineSection(filename) {
    for (const [key, section] of Object.entries(sections)) {
        if (section.pattern.test(filename)) {
            return {
                key,
                emoji: section.emoji,
                title: section.title
            };
        }
    }
    return null;
}

/**
 * Extrait le titre de la page à partir du contenu HTML
 * @param {string} content - Contenu HTML de la page
 * @returns {string|null} - Titre de la page ou null si non trouvé
 */
function extractPageTitle(content) {
    // Essayer d'extraire de la balise <h1>
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
        return h1Match[1].replace(/<[^>]*>/g, '').trim(); // Supprime les balises HTML imbriquées
    }
    
    // Sinon, essayer d'extraire de la balise <title>
    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1].replace(/ - Le Monde des Curieux.*$/i, '').trim();
        return title;
    }
    
    return null;
}

/**
 * Génère le code HTML du fil d'Ariane pour une page
 * @param {string} pageTitle - Titre de la page
 * @param {Object} section - Informations sur la section
 * @returns {string} - Code HTML du fil d'Ariane
 */
function generateBreadcrumb(pageTitle, section) {
    if (section) {
        // Si c'est une page de section principale
        if (pageTitle === section.title || pageTitle.includes(section.title)) {
            return `<div class="breadcrumb" aria-label="Fil d'Ariane">🏠 <a href="index.html">Accueil</a> > ${section.emoji} ${section.title}</div>`;
        }
        
        // Si c'est une sous-page dans une section
        return `<div class="breadcrumb" aria-label="Fil d'Ariane">🏠 <a href="index.html">Accueil</a> > ${section.emoji} <a href="${section.key}_section.html">${section.title}</a> > ${pageTitle}</div>`;
    }
    
    // Si aucune section n'est identifiée, utiliser juste le titre
    return `<div class="breadcrumb" aria-label="Fil d'Ariane">🏠 <a href="index.html">Accueil</a> > ${pageTitle}</div>`;
}

/**
 * Ajoute ou met à jour le fil d'Ariane dans une page HTML
 * @param {string} content - Contenu HTML de la page
 * @param {string} breadcrumbHTML - Code HTML du fil d'Ariane à ajouter
 * @returns {string} - Contenu HTML modifié
 */
function addOrUpdateBreadcrumb(content, breadcrumbHTML) {
    // Vérifier si un fil d'Ariane existe déjà
    if (content.includes('<div class="breadcrumb"')) {
        // Remplacer le fil d'Ariane existant
        return content.replace(/<div class="breadcrumb"[^>]*>.*?<\/div>/is, breadcrumbHTML);
    }
    
    // Sinon, ajouter un nouveau fil d'Ariane après la balise <body>
    return content.replace(/<body[^>]*>/i, `$&\n    ${breadcrumbHTML}`);
}

/**
 * Traite un fichier HTML pour ajouter ou mettre à jour le fil d'Ariane
 * @param {string} filePath - Chemin du fichier HTML à traiter
 */
function processBreadcrumb(filePath) {
    try {
        const filename = path.basename(filePath);
        
        // Ignorer les fichiers spécifiés
        if (excludeFiles.includes(filename)) {
            console.log(`Ignoring excluded file: ${filePath}`);
            filesSkipped++;
            return;
        }
        
        console.log(`Processing: ${filePath}`);
        filesProcessed++;
        
        // Lire le contenu du fichier
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extraire le titre de la page
        const pageTitle = extractPageTitle(content);
        if (!pageTitle) {
            console.log(`  ⚠️ Impossible d'extraire le titre de la page: ${filePath}`);
            filesWithErrors++;
            return;
        }
        
        // Déterminer la section
        const section = determineSection(filename);
        
        // Générer le fil d'Ariane
        const breadcrumbHTML = generateBreadcrumb(pageTitle, section);
        
        // Ajouter ou mettre à jour le fil d'Ariane
        const modifiedContent = addOrUpdateBreadcrumb(content, breadcrumbHTML);
        
        // Vérifier si le contenu a été modifié
        if (modifiedContent === content) {
            console.log(`  ℹ️ Aucune modification nécessaire`);
            return;
        }
        
        // Sauvegarder le fichier modifié
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
        console.log(`  ✓ Fil d'Ariane ajouté/mis à jour`);
        filesModified++;
        
    } catch (error) {
        console.error(`  ❌ Erreur lors du traitement de ${filePath}:`, error.message);
        filesWithErrors++;
    }
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
            processBreadcrumb(itemPath);
        }
    }
}

// Point d'entrée principal
console.log('=== Ajout/mise à jour des fils d\'Ariane ===\n');

// Exécute le traitement
try {
    processDirectory(rootDir);
    
    // Affiche les statistiques
    console.log('\n=== Résumé ===');
    console.log(`Fichiers HTML traités: ${filesProcessed}`);
    console.log(`Fichiers modifiés: ${filesModified}`);
    console.log(`Fichiers ignorés: ${filesSkipped}`);
    console.log(`Fichiers avec erreurs: ${filesWithErrors}`);
    console.log('\nTraitement terminé!');
    
} catch (error) {
    console.error('Erreur globale:', error.message);
}