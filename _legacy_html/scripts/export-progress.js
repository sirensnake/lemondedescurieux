// Dans scripts/export-progress.js
import { jsPDF } from 'jspdf';

function exportProgressPDF() {
  const progress = JSON.parse(localStorage.getItem('userProgress')) || {};
  const doc = new jsPDF();
  
  // Configuration du document
  doc.setFont('Minecraft', 'normal');
  doc.setFontSize(16);
  
  // Ajout du contenu
  doc.text('Le Monde des Curieux - Progression', 20, 20);
  // Ajout des détails de progression
  
  // Sauvegarde du PDF
  doc.save('mon-parcours-curieux.pdf');
}