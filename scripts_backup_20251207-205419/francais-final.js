/* ============================================================================
   FICHIER DE FALLBACK - FRANÇAIS
   Fichier: scripts/francais-final.js
   ============================================================================ */

// Ce fichier sert de fallback pour éviter les erreurs 404
console.log('✅ francais-final.js chargé (fallback)');

// Debug pour vérifier que tous les composants sont disponibles
window.FrenchDebug = {
  checkSystems: function() {
    console.log('🔍 Vérification des systèmes:', {
      'FrenchApp': typeof FrenchApp,
      'FrenchStreaks': typeof FrenchStreaks,
      'FrenchHearts': typeof FrenchHearts,
      'FRANCAIS_LESSONS_DATA': typeof FRANCAIS_LESSONS_DATA,
      'FRANCAIS_PROGRESSION': typeof FRANCAIS_PROGRESSION
    });
  },
  
  getAppInstance: function() {
    return window.frenchApp;
  },
  
  resetProgress: function() {
    if (confirm('Réinitialiser toute la progression ?')) {
      localStorage.removeItem('francais_user_progress');
      localStorage.removeItem('francais_streak_data');
      localStorage.removeItem('francais_hearts_data');
      location.reload();
    }
  }
};

// Auto-diagnostic au chargement
setTimeout(() => {
  window.FrenchDebug.checkSystems();
}, 1000);