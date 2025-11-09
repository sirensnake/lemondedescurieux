// scripts/mindmap-touch-enhanced.js
class MindmapTouchEnhanced {
    constructor() {
        this.touchMetrics = this.initMetrics();
        this.setupTouchHandlers();
        this.setupMetricsTracking();
    }
    
    // ========================================
    // INITIALISATION MÉTRIQUES
    // ========================================
    
    initMetrics() {
        return {
            // Métriques de base
            totalTouches: 0,
            successfulTaps: 0,
            missedTaps: 0,
            doubleTaps: 0,
            longPresses: 0,
            
            // Métriques temporelles
            averageTapDuration: 0,
            fastestTap: Infinity,
            slowestTap: 0,
            
            // Métriques spatiales
            touchPositions: [],
            heatmapData: new Map(),
            
            // Métriques de session
            sessionStart: Date.now(),
            lastTouchTime: null,
            
            // === MÉTRIQUES JOUR 6 (Nouvelle section) ===
            day6Metrics: {
                // Patterns d'interaction
                touchSequences: [],
                interactionPatterns: {
                    sequential: 0,    // Touches séquentielles rapides
                    scattered: 0,     // Touches éparpillées
                    repeated: 0       // Touches répétées sur même zone
                },
                
                // Précision tactile
                precisionScore: 0,
                targetAccuracy: [],   // Précision par zone
                edgeTouches: 0,       // Touches sur bords (moins précises)
                centerTouches: 0,     // Touches au centre (plus précises)
                
                // Comportement utilisateur
                hesitationCount: 0,   // Pauses avant clic
                correctionCount: 0,   // Corrections de trajectoire
                explorationScore: 0,  // Score d'exploration de la carte
                
                // Performance
                responseTime: [],     // Temps de réponse par interaction
                errorRate: 0,         // Taux d'erreur
                retryCount: 0,        // Nombre de réessais
                
                // Engagement
                dwellTime: [],        // Temps passé par zone
                revisitCount: new Map(), // Nombre de visites par zone
                pathComplexity: 0     // Complexité du parcours
            }
        };
    }
    
    // ========================================
    // GESTIONNAIRES TACTILES DE BASE
    // ========================================
    
    setupTouchHandlers() {
        const areas = document.querySelectorAll('map[name="matieresmap"] area');
        const mindmapImg = document.querySelector('.mindmap');
        
        areas.forEach((area, index) => {
            let touchStartTime = 0;
            let touchStartPos = null;
            
            area.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchStartTime = Date.now();
                touchStartPos = this.getTouchPosition(e);
                
                this.trackTouchStart(area, touchStartPos, index);
                this.showTouchFeedback(area, touchStartPos);
            }, { passive: false });
            
            area.addEventListener('touchend', (e) => {
                e.preventDefault();
                const touchDuration = Date.now() - touchStartTime;
                const touchEndPos = this.getTouchPosition(e.changedTouches[0]);
                
                this.trackTouchEnd(area, touchStartPos, touchEndPos, touchDuration, index);
                this.processTouchMetrics(touchDuration, touchStartPos, touchEndPos);
                
                // Navigation si tap valide
                if (touchDuration < 300 && this.isValidTap(touchStartPos, touchEndPos)) {
                    setTimeout(() => {
                        window.location.href = area.href;
                    }, 100);
                }
            }, { passive: false });
        });
        
        // Tracking touches manquées
        mindmapImg.addEventListener('touchstart', (e) => {
            if (e.target === mindmapImg) {
                this.trackMissedTap(this.getTouchPosition(e));
            }
        });
    }
    
    // ========================================
    // TRACKING MÉTRIQUES JOUR 6
    // ========================================
    
    setupMetricsTracking() {
        // Démarrer suivi des métriques avancées
        this.metricsInterval = setInterval(() => {
            this.analyzeDay6Patterns();
            this.calculateDay6Scores();
            this.saveMetrics();
        }, 5000); // Analyse toutes les 5 secondes
    }
    
    trackTouchStart(area, position, index) {
        this.touchMetrics.totalTouches++;
        this.touchMetrics.lastTouchTime = Date.now();
        
        // === MÉTRIQUES JOUR 6 : Début interaction ===
        const d6 = this.touchMetrics.day6Metrics;
        
        // Enregistrer position pour analyse de pattern
        d6.touchSequences.push({
            areaIndex: index,
            position: position,
            timestamp: Date.now(),
            type: 'start'
        });
        
        // Calculer hésitation (pause > 2s avant toucher)
        if (this.touchMetrics.lastTouchTime) {
            const timeSinceLastTouch = Date.now() - this.touchMetrics.lastTouchTime;
            if (timeSinceLastTouch > 2000 && timeSinceLastTouch < 10000) {
                d6.hesitationCount++;
            }
        }
        
        // Tracking précision spatiale
        const coords = this.getAreaCoords(area);
        const isEdge = this.isEdgeTouch(position, coords);
        
        if (isEdge) {
            d6.edgeTouches++;
        } else {
            d6.centerTouches++;
        }
        
        // Tracking revisites
        const areaId = area.getAttribute('href');
        d6.revisitCount.set(areaId, (d6.revisitCount.get(areaId) || 0) + 1);
    }
    
    trackTouchEnd(area, startPos, endPos, duration, index) {
        const isValidTap = this.isValidTap(startPos, endPos);
        
        if (isValidTap) {
            this.touchMetrics.successfulTaps++;
        } else {
            this.touchMetrics.missedTaps++;
        }
        
        // === MÉTRIQUES JOUR 6 : Fin interaction ===
        const d6 = this.touchMetrics.day6Metrics;
        
        // Enregistrer séquence complète
        d6.touchSequences.push({
            areaIndex: index,
            position: endPos,
            timestamp: Date.now(),
            duration: duration,
            type: 'end',
            success: isValidTap
        });
        
        // Temps de réponse (temps entre début touch et fin)
        d6.responseTime.push(duration);
        
        // Correction de trajectoire (mouvement significatif)
        const movement = this.calculateDistance(startPos, endPos);
        if (movement > 20) { // > 20px de mouvement
            d6.correctionCount++;
        }
        
        // Taux d'erreur
        if (!isValidTap) {
            d6.retryCount++;
        }
        d6.errorRate = d6.retryCount / this.touchMetrics.totalTouches;
        
        // Temps passé sur zone (dwell time)
        d6.dwellTime.push({
            area: area.getAttribute('href'),
            duration: duration
        });
    }
    
    trackMissedTap(position) {
        this.touchMetrics.missedTaps++;
        
        // === MÉTRIQUES JOUR 6 : Tap manqué ===
        const d6 = this.touchMetrics.day6Metrics;
        
        d6.touchSequences.push({
            areaIndex: -1, // Pas de zone touchée
            position: position,
            timestamp: Date.now(),
            type: 'missed'
        });
        
        d6.retryCount++;
    }
    
    // ========================================
    // ANALYSE PATTERNS JOUR 6
    // ========================================
    
    analyzeDay6Patterns() {
        const d6 = this.touchMetrics.day6Metrics;
        const sequences = d6.touchSequences.slice(-10); // Dernières 10 touches
        
        if (sequences.length < 3) return;
        
        // Pattern séquentiel (touches rapides consécutives)
        let sequentialCount = 0;
        for (let i = 1; i < sequences.length; i++) {
            const timeDiff = sequences[i].timestamp - sequences[i-1].timestamp;
            if (timeDiff < 1000) { // < 1 seconde
                sequentialCount++;
            }
        }
        if (sequentialCount > sequences.length * 0.6) {
            d6.interactionPatterns.sequential++;
        }
        
        // Pattern éparpillé (touches sur zones éloignées)
        let scatteredScore = 0;
        for (let i = 1; i < sequences.length; i++) {
            const distance = this.calculateDistance(
                sequences[i].position,
                sequences[i-1].position
            );
            if (distance > 200) { // > 200px
                scatteredScore++;
            }
        }
        if (scatteredScore > sequences.length * 0.5) {
            d6.interactionPatterns.scattered++;
        }
        
        // Pattern répété (même zone multiple fois)
        const areaCounts = new Map();
        sequences.forEach(seq => {
            if (seq.areaIndex !== -1) {
                areaCounts.set(seq.areaIndex, (areaCounts.get(seq.areaIndex) || 0) + 1);
            }
        });
        const maxRepeats = Math.max(...areaCounts.values());
        if (maxRepeats > 2) {
            d6.interactionPatterns.repeated++;
        }
    }
    
    calculateDay6Scores() {
        const d6 = this.touchMetrics.day6Metrics;
        
        // Score de précision (0-100)
        const totalTargetTouches = d6.centerTouches + d6.edgeTouches;
        if (totalTargetTouches > 0) {
            d6.precisionScore = Math.round(
                (d6.centerTouches / totalTargetTouches) * 100
            );
        }
        
        // Score d'exploration (nombre de zones visitées / total)
        const uniqueAreas = d6.revisitCount.size;
        const totalAreas = document.querySelectorAll('map[name="matieresmap"] area').length;
        d6.explorationScore = Math.round(
            (uniqueAreas / totalAreas) * 100
        );
        
        // Complexité du parcours (variance des distances)
        if (d6.touchSequences.length > 2) {
            const distances = [];
            for (let i = 1; i < d6.touchSequences.length; i++) {
                const dist = this.calculateDistance(
                    d6.touchSequences[i].position,
                    d6.touchSequences[i-1].position
                );
                distances.push(dist);
            }
            d6.pathComplexity = this.calculateVariance(distances);
        }
    }
    
    // ========================================
    // UTILITAIRES
    // ========================================
    
    getTouchPosition(touch) {
        const rect = document.querySelector('.mindmap').getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }
    
    getAreaCoords(area) {
        const coords = area.coords.split(',').map(Number);
        if (area.shape === 'circle') {
            return {
                x: coords[0],
                y: coords[1],
                radius: coords[2]
            };
        }
        // Gérer autres shapes si nécessaire
        return null;
    }
    
    isEdgeTouch(position, areaCoords) {
        if (!areaCoords) return false;
        
        // Pour un cercle
        const distance = Math.sqrt(
            Math.pow(position.x - areaCoords.x, 2) +
            Math.pow(position.y - areaCoords.y, 2)
        );
        
        // Edge = dans les 20% externes du rayon
        return distance > (areaCoords.radius * 0.8);
    }
    
    isValidTap(startPos, endPos) {
        const distance = this.calculateDistance(startPos, endPos);
        return distance < 15; // < 15px de mouvement = tap valide
    }
    
    calculateDistance(pos1, pos2) {
        return Math.sqrt(
            Math.pow(pos2.x - pos1.x, 2) +
            Math.pow(pos2.y - pos1.y, 2)
        );
    }
    
    calculateVariance(numbers) {
        const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const variance = numbers.reduce((sum, num) => {
            return sum + Math.pow(num - mean, 2);
        }, 0) / numbers.length;
        return Math.round(variance);
    }
    
    showTouchFeedback(area, position) {
        // Animation visuelle du touch
        const feedback = document.createElement('div');
        feedback.className = 'touch-ripple';
        feedback.style.left = `${position.x}px`;
        feedback.style.top = `${position.y}px`;
        
        document.querySelector('.mindmap').parentElement.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 600);
        
        // Vibration si supportée
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    // ========================================
    // SAUVEGARDE & EXPORT
    // ========================================
    
    saveMetrics() {
        localStorage.setItem('mindmapTouchMetrics', JSON.stringify(this.touchMetrics));
    }
    
    exportMetricsReport() {
        const d6 = this.touchMetrics.day6Metrics;
        
        const report = {
            sessionDuration: Date.now() - this.touchMetrics.sessionStart,
            totalInteractions: this.touchMetrics.totalTouches,
            
            // Précision
            precisionScore: d6.precisionScore,
            successRate: (this.touchMetrics.successfulTaps / this.touchMetrics.totalTouches * 100).toFixed(1),
            errorRate: (d6.errorRate * 100).toFixed(1),
            
            // Comportement
            explorationScore: d6.explorationScore,
            hesitations: d6.hesitationCount,
            corrections: d6.correctionCount,
            
            // Performance
            avgResponseTime: this.average(d6.responseTime),
            pathComplexity: d6.pathComplexity,
            
            // Patterns
            patterns: d6.interactionPatterns,
            
            // Zones populaires
            topAreas: Array.from(d6.revisitCount.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
        };
        
        console.log('📊 RAPPORT MÉTRIQUES TACTILES JOUR 6:', report);
        return report;
    }
    
    average(arr) {
        if (arr.length === 0) return 0;
        return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }
}

// Initialisation
let mindmapTouch;
document.addEventListener('DOMContentLoaded', () => {
    mindmapTouch = new MindmapTouchEnhanced();
});