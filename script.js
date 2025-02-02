function loadSection(page) {
    const contentArea = document.getElementById('content');
    contentArea.innerHTML = '<p>Chargement...</p>';

    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement de ${page}`);
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
        })
        .catch(error => {
            contentArea.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
        });
}
