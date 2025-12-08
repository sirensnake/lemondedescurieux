// ====================================
// MATHS APP - VERSION COMPLETE
// ====================================

const MATHS_LESSONS_DATA = {
    1: {
        id: 1,
        title: "Tables de Multiplication",
        description: "Maîtrise les tables de 2 à 5",
        icon: "✖️",
        exercises: [
            { question: "3 × 4", answer: "12", hint: "C'est 3 fois 4, ou 4+4+4" },
            { question: "5 × 6", answer: "30", hint: "Pense à 5 fois 6, ou compte par 5 : 5, 10, 15..." },
            { question: "7 × 3", answer: "21", hint: "7 fois 3, ou 7+7+7" },
            { question: "4 × 8", answer: "32", hint: "C'est le double de 4×4" },
            { question: "9 × 5", answer: "45", hint: "Compte par 5 jusqu'à 9 fois" }
        ]
    },
    2: {
        id: 2,
        title: "Additions avec Retenue",
        description: "Additionne les grands nombres",
        icon: "➕",
        exercises: [
            { question: "125 + 48", answer: "173", hint: "Additionne colonne par colonne, n'oublie pas les retenues" },
            { question: "267 + 156", answer: "423", hint: "Commence par les unités : 7+6=13, pose 3 et retiens 1" },
            { question: "89 + 76", answer: "165", hint: "9+6=15, pose 5 et retiens 1" },
            { question: "345 + 289", answer: "634", hint: "Attention aux retenues sur chaque colonne" }
        ]
    },
    3: {
        id: 3,
        title: "Soustractions",
        description: "Soustrais sans te tromper",
        icon: "➖",
        exercises: [
            { question: "85 - 23", answer: "62", hint: "5-3=2, puis 8-2=6" },
            { question: "142 - 67", answer: "75", hint: "Il faut emprunter une dizaine" },
            { question: "200 - 145", answer: "55", hint: "Transforme 200 en 199+1 pour faciliter" },
            { question: "324 - 158", answer: "166", hint: "Emprunte quand nécessaire" }
        ]
    },
    4: {
        id: 4,
        title: "Les Fractions",
        description: "Découvre les parts",
        icon: "🍕",
        exercises: [
            { question: "1/2 de 10", answer: "5", hint: "La moitié de 10" },
            { question: "1/4 de 20", answer: "5", hint: "Divise 20 par 4" },
            { question: "3/4 de 12", answer: "9", hint: "D'abord trouve 1/4 de 12, puis multiplie par 3" },
            { question: "2/3 de 15", answer: "10", hint: "Divise 15 par 3, puis multiplie par 2" }
        ]
    }
};

class MathsApp {
    constructor() {
        this.currentLesson = null;
        this.currentExerciseIndex = 0;
        this.hearts = 5;
        this.correctAnswers = 0;
        this.totalXP = this.loadXP();
        this.initializeUI();
    }

    loadXP() {
        return parseInt(localStorage.getItem('maths_xp') || '0');
    }

    saveXP() {
        localStorage.setItem('maths_xp', this.totalXP.toString());
    }

    initializeUI() {
        this.renderLessons();
        this.updateStatsDisplay();
    }

    renderLessons() {
        const grid = document.getElementById('lessons-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        Object.values(MATHS_LESSONS_DATA).forEach(lesson => {
            const card = document.createElement('div');
            card.className = 'lesson-card';
            card.onclick = () => this.startLesson(lesson.id);
            card.innerHTML = `
                <div class="lesson-icon">${lesson.icon}</div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-desc">${lesson.description}</div>
                <div style="font-size: 0.7rem; color: #999; margin-bottom: 1rem;">${lesson.exercises.length} exercices</div>
                <button class="lesson-button">⭐ Commencer</button>
            `;
            grid.appendChild(card);
        });
    }

    startLesson(lessonId) {
        this.currentLesson = MATHS_LESSONS_DATA[lessonId];
        this.currentExerciseIndex = 0;
        this.hearts = 5;
        this.correctAnswers = 0;
        
        document.getElementById('lessons-list').style.display = 'none';
        document.getElementById('exercise-screen').style.display = 'block';
        document.getElementById('results-screen').style.display = 'none';
        
        this.showExercise();
    }

    showExercise() {
        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        const progress = ((this.currentExerciseIndex) / this.currentLesson.exercises.length) * 100;
        
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('question-text').textContent = exercise.question + ' = ?';
        document.getElementById('answer-input').value = '';
        document.getElementById('hint-area').textContent = '';
        document.getElementById('answer-input').focus();
        
        this.updateHeartsDisplay();
        
        // Détection touche Enter pour valider
        document.getElementById('answer-input').onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkAnswer();
            }
        };
    }

    showHint() {
        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        document.getElementById('hint-area').textContent = '💡 ' + exercise.hint;
    }

    checkAnswer() {
        const userAnswer = document.getElementById('answer-input').value.trim();
        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        
        if (!userAnswer) return;
        
        if (userAnswer === exercise.answer) {
            this.correctAnswers++;
            this.totalXP += 10;
            this.saveXP();
            this.showFeedback(true);
            
            setTimeout(() => {
                this.currentExerciseIndex++;
                if (this.currentExerciseIndex < this.currentLesson.exercises.length) {
                    this.showExercise();
                } else {
                    this.showResults();
                }
            }, 1500);
        } else {
            this.hearts--;
            this.showFeedback(false);
            this.updateHeartsDisplay();
            
            if (this.hearts === 0) {
                setTimeout(() => this.showResults(), 1500);
            }
        }
        
        this.updateStatsDisplay();
    }

    showFeedback(correct) {
        const feedback = document.getElementById('feedback');
        if (correct) {
            feedback.innerHTML = `
                <div class="feedback-icon feedback-correct">✓</div>
                <div style="font-size: 1.2rem; color: #4caf50;">Bravo !</div>
                <div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">+10 XP</div>
            `;
        } else {
            feedback.innerHTML = `
                <div class="feedback-icon feedback-wrong">✗</div>
                <div style="font-size: 1.2rem; color: #f44336;">Réessaie !</div>
                <div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">-1 ❤️</div>
            `;
        }
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 1200);
    }

    showResults() {
        const totalExercises = this.currentLesson.exercises.length;
        const score = Math.round((this.correctAnswers / totalExercises) * 100);
        const xpEarned = this.correctAnswers * 10;
        
        document.getElementById('exercise-screen').style.display = 'none';
        document.getElementById('results-screen').style.display = 'block';
        
        document.getElementById('result-correct').textContent = this.correctAnswers + '/' + totalExercises;
        document.getElementById('result-xp').textContent = xpEarned;
        document.getElementById('result-hearts').textContent = this.hearts;
        document.getElementById('result-score').textContent = score + '%';
    }

    updateHeartsDisplay() {
        const heartsStr = '❤️'.repeat(this.hearts) + '🖤'.repeat(5 - this.hearts);
        document.getElementById('hearts-exercise').textContent = heartsStr;
    }

    updateStatsDisplay() {
        document.getElementById('xp-display').textContent = this.totalXP + ' XP';
        document.getElementById('hearts-display').textContent = '❤️'.repeat(5);
    }

    backToLessons() {
        document.getElementById('lessons-list').style.display = 'block';
        document.getElementById('exercise-screen').style.display = 'none';
        document.getElementById('results-screen').style.display = 'none';
        this.updateStatsDisplay();
    }
}

// Initialize app
const mathsApp = new MathsApp();
console.log('✅ MathsApp loaded');
