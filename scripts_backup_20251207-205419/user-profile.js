// Dans scripts/user-profile.js
class UserProfile {
    constructor() {
      this.profileData = this.loadProfile() || this.createDefaultProfile();
    }
    
    loadProfile() {
      return JSON.parse(localStorage.getItem('userProfile'));
    }
    
    createDefaultProfile() {
      const defaultProfile = {
        avatar: 'default.png',
        nickname: 'Explorateur',
        theme: 'default',
        preferences: {},
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    
    updateProfile(newData) {
      const updatedProfile = {...this.profileData, ...newData};
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      this.profileData = updatedProfile;
    }
  }