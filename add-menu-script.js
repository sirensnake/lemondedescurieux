/**
 * Script pour ajouter la référence au script du menu latéral à toutes les pages HTML
 * 
 * Usage: 
 * 1. Installez Node.js si ce n'est pas déjà fait
 * 2. Sauvegardez ce script dans le répertoire racine de votre projet
 * 3. Exécutez la commande: node add-menu-script.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = './'; // Répertoire racine du projet
const scriptToAdd = '<script src="scripts/menu-lateral.js"></script>';
const menuContainerToAdd = '<div id="menu-container"></div>';
const filesToExclude = ['.git', 'node_modules']; // Dossiers à ignorer

// Compteurs pour les statistiques
let filesProcessed = 0;
let scriptsAdded = 0;
let containersAdded = 0;
let filesSkipped = 0;
let filesWithErrors = 0;

/**
 * Vérifie si un fichier HTML contient déjà la référence au script du menu latéral
 * @param {string} content - Contenu du fichier HTML
 * @returns {boolean} - True si la référence existe déjà
 */
function hasMenuScriptReference(content) {
    return content.includes('src="scripts/menu-lateral.js"') || 
           content.includes("src='scripts/menu-lateral.js'");
}

/**
 * Vérifie si un fichier HTML contient déjà le conteneur du menu
 * @param {string} content - Contenu du fichier HTML
 * @returns {boolean} - True si le conteneur existe déjà
 */
function hasMenuContainer(content) {
    return content.includes('id="menu-container"') || 
           content.includes("id='menu-container'");
}

/**
 * Ajoute la référence au script du menu dans la section head ou body d'un fichier HTML
 * @param {string} content - Contenu du fichier HTML
 * @returns {Object} - Contenu modifié et indicateur de modification
 */
function addMenuScript(content) {
    let modified = false;
    let newContent = content;
    
    // Si le script n'est pas déjà présent
    if (!hasMenuScriptReference(content)) {
        // Chercher d'abord avant </body>
        let bodyEndIndex = content.lastIndexOf('</body>');
        
        if (bodyEndIndex !== -1) {
            // Insérer avant </body>
            newContent = content.substring(0, bodyEndIndex) + 
                   '  ' + scriptToAdd + '\n  ' + 
                   content.substring(bodyEndIndex);
            modified = true;
        } else {
            // Chercher avant </head> si </body> n'est pas trouvé
            let headEndIndex = content.indexOf('</head>');
            
            if (headEndIndex !== -1) {
                // Insérer avant </head>
                newContent = content.substring(0, headEndIndex) + 
                       '  ' + scriptToAdd + '\n  ' + 
                       content.substring(headEndIndex);
                modified = true;
            } else {
                console.error('  ⚠️ Ni </head> ni </body> trouvé');
                return { content: newContent, modified: false };
            }
        }
    }
    
    return { content: newContent, modified };
}

/**
 * Ajoute le conteneur du menu dans le corps d'un fichier HTML s'il n'existe pas déjà
 * @param {string} content - Contenu du fichier HTML
 * @returns {Object} - Contenu modifié et indicateur de modification
 */
function addMenuContainer(content) {
    // Si le conteneur n'est pas déjà présent
    if (!hasMenuContainer(content)) {
        // Chercher l'ouverture du corps
        const bodyStartIndex = content.indexOf('<body');
        
        if (bodyStartIndex === -1) {
            console.error('  ⚠️ Balise <body> non trouvée');
            return { content, modified: false };
        }
        
        // Trouver où le corps se termine effectivement (après les attributs)
        const bodyOpenEndIndex = content.indexOf('>', bodyStartIndex);
        
        if (bodyOpenEndIndex === -1) {
            console.error('  ⚠️ Balise <body> mal formatée');
            return { content, modified: false };
        }
        
        // Insérer juste après l'ouverture complète de body
        const modifiedContent = content.substring(0, bodyOpenEndIndex + 1) + 
                             '\n  ' + menuContainerToAdd + content.substring(bodyOpenEndIndex + 1);
        
        return { content: modifiedContent, modified: true };
    }
    
    return { content, modified: false };
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
 * Traite un fichier HTML pour ajouter les éléments nécessaires au menu latéral
 * @param {string} filePath - Chemin du fichier HTML à traiter
 */
function processHtmlFile(filePath) {
    try {
        console.log(`Traitement de ${filePath}`);
        filesProcessed++;
        
        // Lit le contenu du fichier
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Ajoute le script du menu si nécessaire
        const scriptResult = addMenuScript(content);
        content = scriptResult.content;
        
        if (scriptResult.modified) {
            scriptsAdded++;
            modified = true;
            console.log(`  ✓ Script du menu ajouté`);
        } else if (hasMenuScriptReference(content)) {
            console.log(`  ✓ Script du menu déjà présent`);
        }
        
        // Ajoute le conteneur du menu si nécessaire
        const containerResult = addMenuContainer(content);
        content = containerResult.content;
        
        if (containerResult.modified) {
            containersAdded++;
            modified = true;
            console.log(`  ✓ Conteneur du menu ajouté`);
        } else if (hasMenuContainer(content)) {
            console.log(`  ✓ Conteneur du menu déjà présent`);
        }
        
        // Si des modifications ont été apportées, sauvegarde le fichier
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✓ Fichier sauvegardé avec les modifications`);
        } else {
            console.log(`  ✓ Aucune modification nécessaire`);
        }
        
    } catch (error) {
        console.error(`  ❌ Erreur lors du traitement de ${filePath}:`, error.message);
        filesWithErrors++;
    }
}

// Point d'entrée principal
console.log('=== Ajout du script et du conteneur du menu latéral à tous les fichiers HTML ===');
console.log(`Script à ajouter: "${scriptToAdd}"`);
console.log(`Conteneur à ajouter: "${menuContainerToAdd}"\n`);

// Exécute le traitement
try {
    processDirectory(rootDir);
    
    // Affiche les statistiques
    console.log('\n=== Résumé ===');
    console.log(`Fichiers HTML traités: ${filesProcessed}`);
    console.log(`Scripts de menu ajoutés: ${scriptsAdded}`);
    console.log(`Conteneurs de menu ajoutés: ${containersAdded}`);
    console.log(`Fichiers ignorés: ${filesSkipped}`);
    console.log(`Fichiers avec erreurs: ${filesWithErrors}`);
    console.log('\nTraitement terminé!');
    
} catch (error) {
    console.error('Erreur globale:', error.message);
}