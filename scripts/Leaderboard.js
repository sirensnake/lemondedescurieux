// Dans scripts/leaderboard.js
class Leaderboard {
    constructor(category = 'general') {
      this.category = category;
      this.entries = this.loadEntries();
    }
    
    loadEntries() {
      // Dans une version simple, utilisation du localStorage
      // En version avancée, utilisation d'une API
      return JSON.parse(localStorage.getItem(`leaderboard_${this.category}`)) || [];
    }
    
    addEntry(score, anonymousCode) {
      const newEntry = {
        anonymousCode,
        score,
        date: new Date().toISOString()
      };
      
      this.entries.push(newEntry);
      this.entries.sort((a, b) => b.score - a.score);
      
      // Limiter à 100 entrées
      if (this.entries.length > 100) {
        this.entries = this.entries.slice(0, 100);
      }
      
      localStorage.setItem(`leaderboard_${this.category}`, JSON.stringify(this.entries));
    }
    
    getTopEntries(limit = 10) {
      return this.entries.slice(0, limit);
    }
  }