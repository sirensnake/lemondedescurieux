import pandas as pd
from jinja2 import Environment, FileSystemLoader
import os

# Charger les données
locations_df = pd.read_csv("data/cities_locations.csv")
content_df = pd.read_csv("data/villes.csv")

# Fusionner les deux sur la colonne "ville"
merged_df = pd.merge(locations_df, content_df, on="ville", how="inner")

print("🔍 Noms trouvés dans cities_locations:", list(locations_df["ville"]))
print("🔍 Noms trouvés dans villes.csv:", list(content_df["ville"]))
print("🔍 Villes fusionnées:", list(merged_df["ville"]))


# Préparer l'environnement Jinja2
env = Environment(loader=FileSystemLoader("templates"))
template = env.get_template("city_template.html")

# Créer le dossier de sortie s'il n'existe pas
output_dir = "cities"
os.makedirs(output_dir, exist_ok=True)

# Générer une page HTML par ville
for _, row in merged_df.iterrows():
    html = template.render(
        ville=row["ville"],
        latitude=row["latitude"],
        longitude=row["longitude"],
        description=row["description"],
        image_url=row["image_url"]
    )
    
    filename = f"{row['ville'].lower().replace(' ', '_')}.html"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)
    
    print(f"✔️ Page générée : {filepath}")
