/* ============================================================================
   FICHIER DE FALLBACK - FRANÇAIS
   Fichier: scripts/francais-final.js
   ============================================================================ */

// Ce fichier sert de fallback pour éviter les erreurs 404
console.log('✅ francais-final.js chargé (fallback)');

// Debug pour vérifier que tous les composants sont disponibles
window.FrancaisDebug = {
  checkSystems: function() {
    console.log('🔍 Vérification des systèmes:', {
      'FrancaisApp': typeof FrancaisApp,
      'FrancaisStreaks': typeof FrancaisStreaks,
      'FrancaisHearts': typeof FrancaisHearts,
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
  window.FrancaisDebug.checkSystems();
}, 1000);