import pandas as pd
import os

# Charger le fichier CSV contenant les informations sur les villes
df = pd.read_csv('data/cities_locations.csv')

# Modèle de page HTML
html_template = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{city_name} - Ville Européenne</title>
    <link rel="stylesheet" href="../styles/section_style.css">
</head>
<body>

    <h1>{city_name} - Ville Européenne</h1>
    <p>{city_name} est une ville mondialement connue, célèbre pour ses monuments, son histoire et sa culture. Elle attire des millions de touristes chaque année.</p>
    
    <h2>Quelques faits intéressants sur {city_name} :</h2>
    <ul>
        <li>Insère ici un fait intéressant sur {city_name}.</li>
        <li>Insère ici un autre fait sur {city_name}.</li>
    </ul>

    <h2>Carte interactive de {city_name}</h2>
    <div id="{city_name}_map" style="width: 100%; height: 400px;"></div>

    <section>
        <a href="../carte_villes_europe_avec_liens.html" class="back-button-container">
            <button class="back-button">Retour à la carte d'Europe 🗺️</button>
        </a>
    </section>

    <script>
        var map = L.map('{city_name}_map').setView([{latitude}, {longitude}], 13); // Latitude et longitude de {city_name}

        L.tileLayer('https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }}).addTo(map);

        var marker = L.marker([{latitude}, {longitude}]).addTo(map);
        marker.bindPopup("<b>{city_name}</b><br>Capitale de la région").openPopup();
    </script>

</body>
</html>
"""

# Boucle pour générer une page HTML pour chaque ville
for index, row in df.iterrows():
    city_name = row['ville']
    latitude = row['latitude']
    longitude = row['longitude']
    
    # Imprimer les valeurs pour vérifier
    print(f"Vérification pour {city_name}:")
    print(f"Latitude: {latitude}, Longitude: {longitude}")
    
    # Vérifier si latitude et longitude sont des nombres valides
    if isinstance(latitude, (int, float)) and isinstance(longitude, (int, float)):
        # Remplir le modèle HTML avec les données de chaque ville
        html_content = html_template.format(
            city_name=city_name, 
            latitude=latitude, 
            longitude=longitude
        )
        
        # Sauvegarder chaque page dans un fichier HTML avec le nom de la ville (en minuscules)
        file_path = f"cities/{city_name.lower()}.html"
        
        # Vérifier si le dossier 'cities/' existe
        if not os.path.exists('cities'):
            os.makedirs('cities')
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        print(f"Page générée pour {city_name}: {file_path}")
    else:
        print(f"Erreur: Les coordonnées de {city_name} ne sont pas valides.")
