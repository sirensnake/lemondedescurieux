// components/duolingo-features.js
export class DuolingoSystem {
  constructor(storage, analytics) {
    this.storage = storage;
    this.analytics = analytics;
    this.features = {
      streak: new StreakManager(storage),
      hearts: new HeartSystem(storage),
      leagues: new LeagueSystem(storage),
      shop: new RewardShop(storage)
    };
  }
  
  async completeLesson(lessonData) {
    // Mise à jour streak
    const streakBonus = this.features.streak.update();
    
    // Calcul XP avec bonus
    let xp = lessonData.score * 10;
    if (streakBonus) xp *= 1.5;
    if (lessonData.perfect) xp *= 2;
    
    // Mise à jour league
    await this.features.leagues.addXP(xp);
    
    // Vérification achievements
    const newAchievements = this.checkAchievements();
    
    return {
      xp,
      streakBonus,
      newAchievements,
      leaguePosition: await this.features.leagues.getPosition()
    };
  }
}