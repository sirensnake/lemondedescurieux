// scripts/modules/storage.js
export class StorageManager {
  constructor(prefix = 'lemondedescurieux_') {
    this.prefix = prefix;
  }
  
  get(key) {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading data:', e);
      return null;
    }
  }
  
  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving data:', e);
      return false;
    }
  }
  
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }
  
  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}