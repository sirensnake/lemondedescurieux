/**
 * Menu latéral intégré - Version sans AJAX pour utilisation file://
 */
document.addEventListener("DOMContentLoaded", function() {
    const menuContainer = document.getElementById('menu-container');
    
    if (!menuContainer) {
        console.error("Conteneur de menu introuvable. Abandon du chargement.");
        return;
    }
    
    // Menu directement intégré dans le script (sans requête AJAX)
    const menuHTML = `
    <div id="sidebar" class="sidebar" role="navigation" aria-label="Menu principal">
        <ul>
            <li><a href="francais_section.html" aria-label="Section Français"><img src="images/francais_icon.png" alt="Icône Français"> Français</a></li>
            <li><a href="maths_section.html" aria-label="Section Mathématiques"><img src="images/maths_icon.png" alt="Icône Maths"> Mathématiques</a></li>
            <li><a href="sciences_section.html" aria-label="Section Sciences"><img src="images/sciences_icon.png" alt="Icône Sciences"> Sciences</a></li>
            <li><a href="histoire_section.html" aria-label="Section Histoire-Géographie"><img src="images/histoire_icon.png" alt="Icône Histoire"> Histoire-Géographie</a></li>
            <li><a href="programmation_section.html" aria-label="Section Programmation"><img src="images/prog_icon.png" alt="Icône Programmation"> Programmation</a></li>
            <li><a href="echecs_section.html" aria-label="Section Échecs"><img src="images/echecs_icon.png" alt="Icône Échecs"> Échecs</a></li>
            <li><a href="philosophie_section.html" aria-label="Section Philosophie"><img src="images/philo_icon.png" alt="Icône Philosophie"> Philosophie</a></li>
            <li><a href="english_section.html" aria-label="Section Anglais"><img src="images/english.png" alt="Icône English"> English</a></li>
            <li><a href="ressources_section.html" aria-label="Section Ressources"><img src="images/ressources_icon.png" alt="Icône Ressources"> Ressources</a></li>
            <li><a href="infos_section.html" aria-label="Section Infos"><img src="images/infos_icon.png" alt="Icône Infos"> Infos</a></li>
            <li><a href="tableau_progression.html">📊 Mes Progrès</a></li>
        </ul>
    </div>

    <button id="sidebar-toggle" class="sidebar-toggle" aria-label="Ouvrir le menu">☰</button>
    `;
    
    // Insérer le menu directement
    menuContainer.innerHTML = menuHTML;
    
    // Configurer le bouton toggle
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");
    
    if (sidebar && toggleButton) {
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', 'sidebar');
        
        toggleButton.addEventListener("click", function() {
            const isOpen = sidebar.classList.toggle("open");
            toggleButton.setAttribute('aria-expanded', isOpen);
        });
        
        // Gestion de la navigation clavier
        const links = sidebar.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('focus', () => {
                sidebar.classList.add('open');
                toggleButton.setAttribute('aria-expanded', 'true');
            });
        });
        
        console.log("Menu latéral configuré avec succès");
    }
});