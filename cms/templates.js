// cms/templates.js
export class TemplateEngine {
  constructor(cms) {
    this.cms = cms;
    this.templates = new Map();
  }
  
  registerTemplate(name, template) {
    this.templates.set(name, {
      name,
      render: template.render,
      schema: template.schema,
      preview: template.preview
    });
  }
  
  async renderContent(contentId, templateName) {
    const content = await this.cms.getContent(contentId);
    const template = this.templates.get(templateName);
    
    if (!template) throw new Error(`Template ${templateName} not found`);
    
    return template.render(content.data);
  }
}

// Templates prédéfinis
const lessonTemplate = {
  schema: {
    title: { type: 'string', required: true },
    objectives: { type: 'array', items: 'string' },
    content: { type: 'richtext' },
    exercises: { type: 'array', items: 'exercise' },
    duration: { type: 'number', min: 5, max: 60 }
  },
  
  render: (data) => `
    <article class="lesson-content">
      <header class="lesson-header">
        <h1>${data.title}</h1>
        <div class="lesson-meta">
          <span class="duration">${data.duration} minutes</span>
          <span class="difficulty">${data.difficulty || 'Moyen'}</span>
        </div>
      </header>
      
      <section class="objectives">
        <h2>Objectifs</h2>
        <ul>
          ${data.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
      </section>
      
      <section class="content">
        ${data.content}
      </section>
      
      <section class="exercises">
        ${data.exercises.map(ex => renderExercise(ex)).join('')}
      </section>
    </article>
  `,
  
  preview: (data) => `
    <div class="lesson-preview">
      <h3>${data.title}</h3>
      <p>${data.objectives.length} objectifs • ${data.duration} min</p>
    </div>
  `
};