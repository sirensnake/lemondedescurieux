// cms/mini-cms.js
export class MiniCMS {
  constructor() {
    this.db = new IndexedDB('lemondedescurieux_cms', 1);
    this.initDB();
  }
  
  async initDB() {
    const db = await this.db.open();
    
    if (!db.objectStoreNames.contains('content')) {
      db.createObjectStore('content', { keyPath: 'id' });
    }
    
    if (!db.objectStoreNames.contains('templates')) {
      db.createObjectStore('templates', { keyPath: 'name' });
    }
  }
  
  async createContent(type, data) {
    const content = {
      id: `${type}_${Date.now()}`,
      type,
      data,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      version: 1,
      published: false
    };
    
    await this.db.put('content', content);
    return content.id;
  }
  
  async updateContent(id, data) {
    const existing = await this.db.get('content', id);
    if (!existing) throw new Error('Content not found');
    
    const updated = {
      ...existing,
      data: { ...existing.data, ...data },
      modified: new Date().toISOString(),
      version: existing.version + 1
    };
    
    // Archiver version précédente
    await this.archiveVersion(existing);
    await this.db.put('content', updated);
    
    return updated;
  }
}

// Interface d'administration
Alpine.data('cmsAdmin', () => ({
  contents: [],
  currentEdit: null,
  filters: {
    type: 'all',
    status: 'all'
  },
  
  async init() {
    this.cms = new MiniCMS();
    await this.loadContents();
  },
  
  async loadContents() {
    const all = await this.cms.getAllContent();
    this.contents = this.applyFilters(all);
  },
  
  editContent(content) {
    this.currentEdit = { ...content };
    this.showEditor = true;
  },
  
  async saveContent() {
    if (this.currentEdit.id) {
      await this.cms.updateContent(this.currentEdit.id, this.currentEdit.data);
    } else {
      await this.cms.createContent(this.currentEdit.type, this.currentEdit.data);
    }
    
    await this.loadContents();
    this.showEditor = false;
  }
}));