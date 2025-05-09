/**
 * Module d'interdisciplinarité pour Le Monde des Curieux
 * Crée des connexions entre les différentes matières pour un apprentissage transversal
 */
class InterdisciplinarityModule {
    constructor() {
        // Définir les connexions entre les matières
        this.connections = this.defineConnections();
        
        // Initialiser les éléments d'interface
        this.initUI();
    }
    
    /**
     * Définit les connexions entre les différentes sections du site
     * @returns {Array} Liste des connexions
     */
    defineConnections() {
        return [
            {
                id: 'ia_programmation',
                sections: ['IA', 'Programmation'],
                title: 'IA et Programmation',
                description: 'Découvre comment la programmation est utilisée pour créer des IA',
                icon: '🤖 + 💻',
                activity: 'Crée un petit chatbot en suivant notre guide de programmation',
                level: 'Intermédiaire',
                link: 'projets/chatbot_simple.html'
            },
            {
                id: 'ia_philosophie',
                sections: ['IA', 'Philosophie'],
                title: 'IA et Éthique',
                description: 'Explore les questions éthiques liées à l\'intelligence artificielle',
                icon: '🤖 + 🧠',
                activity: 'Réfléchis aux règles que devraient suivre les robots intelligents',
                level: 'Débutant',
                link: 'activites/ethique_ia.html'
            },
            {
                id: 'programmation_maths',
                sections: ['Programmation', 'Mathématiques'],
                title: 'Programmation et Math',
                description: 'Utilise le code pour résoudre des problèmes mathématiques',
                icon: '💻 + 🔢',
                activity: 'Crée un calculateur graphique qui dessine des formes',
                level: 'Avancé',
                link: 'projets/calculateur_graphique.html'
            },
            {
                id: 'infos_philosophie',
                sections: ['Infos', 'Philosophie'],
                title: 'Information et Esprit Critique',
                description: 'Apprends à analyser les informations avec un regard critique',
                icon: '📰 + 🧠',
                activity: 'Identifie des fausses informations et explique pourquoi elles sont fausses',
                level: 'Intermédiaire',
                link: 'activites/detection_fake_news.html'
            },
            {
                id: 'ia_infos',
                sections: ['IA', 'Infos'],
                title: 'IA et Médias',
                description: 'Découvre comment l\'IA transforme les médias et l\'information',
                icon: '🤖 + 📰',
                activity: 'Essaie de distinguer les images créées par IA des photos réelles',
                level: 'Débutant',
                link: 'activites/images_ia.html'
            }
        ];
    }
    
    /**
     * Initialise les éléments d'interface
     */
    initUI() {
        // Rechercher les conteneurs d'interdisciplinarité sur la page
        const containers = document.querySelectorAll('.interdisciplinarite-container');
        
        containers.forEach(container => {
            // Vérifier si un type spécifique est demandé
            const section = container.dataset.section;
            
            // Afficher les connexions appropriées
            this.displayConnections(container, section);
        });
        
        // Ajouter des liens d'interdisciplinarité aux pages de sections
        this.addSectionLinks();
    }
    
    /**
     * Affiche les connexions dans un conteneur
     * @param {HTMLElement} container - Conteneur HTML
     * @param {string} section - Section actuelle (facultatif)
     */
    displayConnections(container, section) {
        // Filtrer les connexions si une section est spécifiée
        const connectionsToShow = section ? 
            this.connections.filter(conn => conn.sections.includes(section)) : 
            this.connections;
        
        // Si aucune connexion n'est trouvée
        if (connectionsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-connections">
                    <p>Aucune connexion interdisciplinaire n'a été trouvée.</p>
                </div>
            `;
            return;
        }
        
        // Créer le titre du conteneur si nécessaire
        if (!container.querySelector('h2')) {
            const titleElement = document.createElement('h2');
            titleElement.textContent = section ? 
                `${section} et autres matières` : 
                'Connexions entre les matières';
            container.appendChild(titleElement);
        }
        
        // Créer la grille de connexions
        const gridElement = document.createElement('div');
        gridElement.className = 'interdisciplinarite-grid';
        
        // Ajouter chaque connexion
        connectionsToShow.forEach(connection => {
            const card = document.createElement('div');
            card.className = 'interdisciplinarite-card';
            card.innerHTML = `
                <div class="connection-header">
                    <div class="connection-icon">${connection.icon}</div>
                    <h3>${connection.title}</h3>
                </div>
                <p class="connection-description">${connection.description}</p>
                <div class="connection-activity">
                    <strong>Activité:</strong> ${connection.activity}
                </div>
                <div class="connection-level">
                    <span class="level-badge ${connection.level.toLowerCase()}">${connection.level}</span>
                </div>
                <a href="${connection.link}" class="connection-link">Explorer cette connexion</a>
            `;
            
            gridElement.appendChild(card);
        });
        
        container.appendChild(gridElement);
    }
    
    /**
     * Ajoute des liens d'interdisciplinarité aux pages de sections
     */
    addSectionLinks() {
        // Détecter la section actuelle
        const currentPage = window.location.pathname.split('/').pop();
        const currentSection = this.detectCurrentSection(currentPage);
        
        if (!currentSection) return;
        
        // Trouver les connexions pour cette section
        const relevantConnections = this.connections.filter(
            conn => conn.sections.includes(currentSection)
        );
        
        if (relevantConnections.length === 0) return;
        
        // Trouver un emplacement pour ajouter les liens (après le premier contenu)
        const contentSections = document.querySelectorAll('.content');
        if (contentSections.length <= 1) return;
        
        // Créer l'élément pour les suggestions interdisciplinaires
        const suggestionsElement = document.createElement('div');
        suggestionsElement.className = 'interdisciplinarite-suggestions';
        suggestionsElement.innerHTML = `
            <h3>Explore les connexions avec d'autres matières :</h3>
            <div class="interdisciplinarite-links">
                ${relevantConnections.map(conn => `
                    <a href="${conn.link}" class="interdisciplinarite-link">
                        <span class="suggestion-icon">${conn.icon}</span>
                        <span class="suggestion-title">${conn.title}</span>
                    </a>
                `).join('')}
            </div>
        `;
        
        // Insérer après la première section de contenu
        contentSections[1].parentNode.insertBefore(suggestionsElement, contentSections[1].nextSibling);
    }
    
    /**
     * Détecte la section actuelle en fonction du nom de page
     * @param {string} pageName - Nom de la page
     * @returns {string|null} - Nom de la section ou null
     */
    detectCurrentSection(pageName) {
        const sectionMappings = {
            'ia_section.html': 'IA',
            'programmation_section.html': 'Programmation',
            'philosophie_section.html': 'Philosophie',
            'infos_section.html': 'Infos',
            'ressources_section.html': 'Ressources'
        };
        
        return sectionMappings[pageName] || null;
    }
}

// Initialiser le module d'interdisciplinarité au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const interdisciplinarityModule = new InterdisciplinarityModule();
});