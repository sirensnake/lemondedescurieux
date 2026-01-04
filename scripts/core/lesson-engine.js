/**
 * ==========================================
 * LESSON ENGINE - MOTEUR UNIVERSEL
 * Le Monde des Curieux
 * ==========================================
 * Gère toutes les sections : Maths, English, Histoire, etc.
 */

class LessonEngine {
    constructor(section, lessonsData) {
        this.section = section;
        this.lessons = lessonsData;
        this.currentLesson = null;
        this.currentExerciseIndex = 0;
        this.hearts = 5;
        this.maxHearts = 5;
        this.streak = this.loadStreak();
        this.xp = this.loadXP();
        this.correctAnswers = 0;
    }
    
    // ========================================
    // SYSTÈME XP UNIVERSEL
    // ========================================
    
    loadXP() {
        return parseInt(localStorage.getItem('curio_xp') || '0');
    }
    
    saveXP(amount) {
        const total = this.loadXP() + amount;
        localStorage.setItem('curio_xp', total);
        this.updateXPDisplay();
    }
    
    // ========================================
    // SYSTÈME STREAKS UNIVERSEL
    // ========================================
    
    loadStreak() {
        const data = JSON.parse(localStorage.getItem(`${this.section}_streak`) || '{}');
        const today = new Date().toDateString();
        
        if (data.lastDate === today) {
            return data.current || 0;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (data.lastDate === yesterday.toDateString()) {
            data.current = (data.current || 0) + 1;
        } else {
            data.current = 1;
        }
        
        data.lastDate = today;
        localStorage.setItem(`${this.section}_streak`, JSON.stringify(data));
        return data.current;
    }
    
    // ========================================
    // SYSTÈME HEARTS UNIVERSEL
    // ========================================
    
    loseHeart() {
        this.hearts--;
        this.updateHeartsDisplay();
        
        if (this.hearts <= 0) {
            this.showGameOver();
            return false;
        }
        return true;
    }
    
    // ========================================
    // AFFICHAGE DES LEÇONS
    // ========================================
    
    renderLessonsGrid() {
        const grid = document.getElementById('lessons-grid');
        const completed = this.getCompletedLessons();
        
        if (!grid) {
            console.error('❌ Element #lessons-grid introuvable');
            return;
        }
        
        grid.innerHTML = this.lessons.map((lesson, index) => {
            const isCompleted = completed.includes(lesson.id);
            const isLocked = index > 14 && !completed.includes(this.lessons[index - 1].id); // ← TOUTES LES LEÇONS DÉBLOQUÉES(this.lessons[index - 1].id);
            
            return `
                <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}"
                     onclick="${!isLocked ? `${this.section}App.startLesson(${index})` : ''}">
                    <div class="emoji">${lesson.emoji}</div>
                    <h3 class="title">${lesson.title}</h3>
                    <div class="xp">⭐ ${lesson.xp} XP</div>
                    ${isLocked ? '<div class="lock">🔒</div>' : ''}
                </div>
            `;
        }).join('');
    }
    
    // ========================================
    // DÉMARRAGE D'UNE LEÇON
    // ========================================
    
    startLesson(index) {
        this.currentLesson = this.lessons[index];
        this.currentExerciseIndex = 0;
        this.hearts = this.maxHearts;
        this.correctAnswers = 0;
        
        // Masquer liste, afficher écran leçon
        document.getElementById('lessons-list').style.display = 'none';
        document.getElementById('lesson-screen').style.display = 'block';
        document.getElementById('exercise-screen').style.display = 'block';
        document.getElementById('results-screen').style.display = 'none';
        
        this.updateHeartsDisplay();
        this.showExercise();
    }
    
    // ========================================
    // AFFICHAGE D'UN EXERCICE
    // ========================================
    
    showExercise() {
        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        
        // Mise à jour barre de progression
        const progress = ((this.currentExerciseIndex + 1) / this.currentLesson.exercises.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        
        // Affichage question
        document.getElementById('question-text').innerText = exercise.question;
        
        // Reset input
        const input = document.getElementById('answer-input');
        input.value = '';
        input.focus();
        
        // Cacher indice
        const hintArea = document.getElementById('hint-area');
        if (hintArea) {
            hintArea.style.display = 'none';
            hintArea.innerText = '';
        }
        
        // Afficher contexte historique si présent (pour Histoire)
        if (this.currentLesson.context && document.getElementById('historical-context')) {
            document.getElementById('historical-context').style.display = 'flex';
            document.getElementById('context-text').innerText = this.currentLesson.context;
            if (this.currentLesson.contextIcon) {
                document.getElementById('context-icon').innerText = this.currentLesson.contextIcon;
            }
        }
    }
    
    // ========================================
    // VÉRIFICATION RÉPONSE
    // ========================================
    
    checkAnswer() {
        const input = document.getElementById('answer-input');
        const userAnswer = input.value.trim().toLowerCase();
        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        
        // Normalisation réponses (accepter variations)
        const correctAnswer = exercise.answer.toLowerCase().trim();
        
        // Tolérance pour réponses numériques
        const isNumeric = !isNaN(parseFloat(correctAnswer));
        const answersMatch = isNumeric 
            ? parseFloat(userAnswer) === parseFloat(correctAnswer)
            : userAnswer === correctAnswer;
        
        if (answersMatch) {
            this.correctAnswers++;
            this.showFeedback('correct', '✅ Correct !');
            
            setTimeout(() => {
                this.currentExerciseIndex++;
                
                if (this.currentExerciseIndex >= this.currentLesson.exercises.length) {
                    this.showResults();
                } else {
                    this.showExercise();
                }
            }, 1000);
        } else {
            // Animation shake
            const exerciseScreen = document.getElementById('exercise-screen');
            exerciseScreen.classList.add('shake');
            setTimeout(() => exerciseScreen.classList.remove('shake'), 500);
            
            this.showFeedback('incorrect', '❌ Réessaie !');
            
            if (!this.loseHeart()) {
                return; // Game over
            }
        }
    }
    
    // ========================================
    // AFFICHAGE FEEDBACK
    // ========================================
    
    showFeedback(type, message) {
        const feedback = document.getElementById('feedback');
        if (!feedback) return;
        
        feedback.className = `feedback ${type}`;
        feedback.innerText = message;
        feedback.style.display = 'block';
        
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
    }
    
    // ========================================
    // INDICE
    // ========================================
    
    showHint() {
        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        const hint = document.getElementById('hint-area');
        
        if (exercise.hint && hint) {
            hint.innerText = '💡 ' + exercise.hint;
            hint.style.display = 'block';
        }
    }
    
    // ========================================
    // AFFICHAGE RÉSULTATS
    // ========================================
    
    showResults() {
        const totalCount = this.currentLesson.exercises.length;
        const score = Math.round((this.correctAnswers / totalCount) * 100);
        const xpEarned = this.currentLesson.xp;
        
        // Sauvegarder XP
        this.saveXP(xpEarned);
        
        // Marquer comme complétée
        this.markLessonCompleted(this.currentLesson.id);
        
        // Afficher écran résultats
        document.getElementById('exercise-screen').style.display = 'none';
        document.getElementById('results-screen').style.display = 'block';
        
        // Remplir statistiques
        document.getElementById('result-correct').innerText = this.correctAnswers;
        document.getElementById('result-xp').innerText = xpEarned;
        document.getElementById('result-hearts').innerText = this.hearts;
        document.getElementById('result-score').innerText = score + '%';
    }
    
    // ========================================
    // RETOUR AUX LEÇONS
    // ========================================
    
    backToLessons() {
        document.getElementById('lesson-screen').style.display = 'none';
        document.getElementById('lessons-list').style.display = 'block';
        this.renderLessonsGrid();
        this.updateAllDisplays();
    }
    
    // ========================================
    // MISE À JOUR AFFICHAGES
    // ========================================
    
    updateXPDisplay() {
        const xp = this.loadXP();
        const el = document.getElementById('xp-display');
        if (el) el.innerText = xp + ' XP';
    }
    
    updateHeartsDisplay() {
        const displays = ['hearts-display', 'hearts-exercise'];
        const heartsHTML = '❤️'.repeat(this.hearts) + '🖤'.repeat(this.maxHearts - this.hearts);
        
        displays.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = heartsHTML;
        });
    }
    
    updateStreakDisplay() {
        const el = document.getElementById('streak-display');
        if (el) {
            const label = this.section === 'english' ? 'days' : 'jours';
            el.innerText = `🔥 ${this.streak} ${label}`;
        }
    }
    
    updateAllDisplays() {
        this.updateXPDisplay();
        this.updateHeartsDisplay();
        this.updateStreakDisplay();
    }
    
    // ========================================
    // GESTION LEÇONS COMPLÉTÉES
    // ========================================
    
    getCompletedLessons() {
        return JSON.parse(localStorage.getItem(`${this.section}_completed`) || '[]');
    }
    
    markLessonCompleted(lessonId) {
        const completed = this.getCompletedLessons();
        if (!completed.includes(lessonId)) {
            completed.push(lessonId);
            localStorage.setItem(`${this.section}_completed`, JSON.stringify(completed));
        }
    }
    
    // ========================================
    // GAME OVER
    // ========================================
    
    showGameOver() {
        this.showFeedback('incorrect', '💔 Plus de cœurs ! La leçon redémarre...');
        
        setTimeout(() => {
            this.hearts = this.maxHearts;
            this.currentExerciseIndex = 0;
            this.correctAnswers = 0;
            this.updateHeartsDisplay();
            this.showExercise();
        }, 2500);
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonEngine;
}

console.log('✅ LessonEngine chargé avec succès');