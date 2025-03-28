import folium
import pandas as pd

# Charger les données depuis le fichier CSV
df = pd.read_csv('cities_locations.csv')

# Créer la carte centrée sur l'Europe
europe_map = folium.Map(location=[54.5260, 15.2551], zoom_start=4)

# Dictionnaire des villes et de leurs pages HTML associées
city_pages = {
    'Paris': 'paris.html',
    'Londres': 'londres.html',
    'Berlin': 'berlin.html',
    'Madrid': 'madrid.html',
    # Ajoute d'autres villes ici si nécessaire
}

# Ajouter des marqueurs pour chaque ville avec un lien cliquable
for index, row in df.iterrows():
    city_name = row['ville']
    city_url = city_pages.get(city_name, '#')  # Récupérer le lien associé à la ville, ou '#' si la ville n'est pas dans le dictionnaire

    # Ajouter le marqueur avec un lien vers la page de la ville
    folium.Marker(
        location=[row['latitude'], row['longitude']],
        popup=f"<a href='{city_url}' target='_blank'>{city_name}</a>",  # Lien cliquable vers la page de la ville
        icon=folium.Icon(color='blue', icon='info-sign')
    ).add_to(europe_map)

# Enregistrer la carte dans un fichier HTML
europe_map.save('carte_villes_europe_avec_liens.html')
