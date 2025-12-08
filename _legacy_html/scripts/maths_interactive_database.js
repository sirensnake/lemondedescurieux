// scripts/maths_interactive_database.js - Mathématiques CM1 gamifiées
class MathsInteractiveDatabase {
    constructor() {
        this.modules = {
            // === CALCUL MENTAL ===
            calcul_mental: {
                title: "Calcul Mental",
                icon: "🧮",
                description: "Additions, soustractions, multiplications rapides",
                levels: {
                    debutant: {
                        title: "Débutant",
                        operations: {
                            addition: {
                                range: [1, 20],
                                timeLimit: 15,
                                examples: [
                                    { a: 7, b: 5, result: 12, explanation: "7 + 5 = 12" },
                                    { a: 12, b: 8, result: 20, explanation: "12 + 8 = 20" },
                                    { a: 15, b: 6, result: 21, explanation: "15 + 6 = 21" }
                                ]
                            },
                            soustraction: {
                                range: [1, 20],
                                timeLimit: 15,
                                examples: [
                                    { a: 15, b: 7, result: 8, explanation: "15 - 7 = 8" },
                                    { a: 20, b: 12, result: 8, explanation: "20 - 12 = 8" },
                                    { a: 18, b: 9, result: 9, explanation: "18 - 9 = 9" }
                                ]
                            }
                        }
                    },
                    
                    intermediaire: {
                        title: "Intermédiaire", 
                        operations: {
                            multiplication: {
                                tables: [2, 3, 4, 5, 10],
                                timeLimit: 12,
                                examples: [
                                    { a: 7, b: 3, result: 21, explanation: "7 × 3 = 21" },
                                    { a: 8, b: 4, result: 32, explanation: "8 × 4 = 32" },
                                    { a: 9, b: 5, result: 45, explanation: "9 × 5 = 45" }
                                ]
                            },
                            division: {
                                divisors: [2, 3, 4, 5, 10],
                                timeLimit: 15,
                                examples: [
                                    { a: 24, b: 4, result: 6, explanation: "24 ÷ 4 = 6" },
                                    { a: 35, b: 5, result: 7, explanation: "35 ÷ 5 = 7" },
                                    { a: 18, b: 3, result: 6, explanation: "18 ÷ 3 = 6" }
                                ]
                            }
                        }
                    },

                    avance: {
                        title: "Avancé",
                        operations: {
                            operations_mixtes: {
                                range: [1, 100],
                                timeLimit: 20,
                                examples: [
                                    { expression: "7 × 8 + 12", result: 68, explanation: "7 × 8 = 56, puis 56 + 12 = 68" },
                                    { expression: "45 ÷ 5 - 3", result: 6, explanation: "45 ÷ 5 = 9, puis 9 - 3 = 6" },
                                    { expression: "6 × (4 + 5)", result: 54, explanation: "4 + 5 = 9, puis 6 × 9 = 54" }
                                ]
                            }
                        }
                    }
                }
            },

            // === GÉOMÉTRIE INTERACTIVE ===
            geometrie: {
                title: "Géométrie",
                icon: "📐",
                description: "Formes, aires, périmètres avec manipulations",
                activities: {
                    formes_bases: {
                        title: "Formes de Base",
                        shapes: [
                            {
                                name: "triangle",
                                properties: {
                                    sides: 3,
                                    angles_sum: 180,
                                    examples: ["triangle équilatéral", "triangle rectangle", "triangle isocèle"]
                                },
                                interactive: {
                                    drag_points: true,
                                    measure_angles: true,
                                    color_sides: true
                                },
                                exercises: [
                                    {
                                        type: "identification",
                                        question: "Combien de côtés a un triangle ?",
                                        options: ["2", "3", "4", "5"],
                                        correct: 1
                                    },
                                    {
                                        type: "construction",
                                        instruction: "Dessine un triangle avec ta souris",
                                        validation: "check_three_sides"
                                    }
                                ]
                            },
                            {
                                name: "rectangle",
                                properties: {
                                    sides: 4,
                                    right_angles: 4,
                                    opposite_sides_equal: true
                                },
                                interactive: {
                                    resize: true,
                                    measure_dimensions: true,
                                    calculate_area: true
                                },
                                exercises: [
                                    {
                                        type: "calculation",
                                        question: "Calcule l'aire d'un rectangle de 6 cm × 4 cm",
                                        answer: 24,
                                        unit: "cm²",
                                        explanation: "Aire = longueur × largeur = 6 × 4 = 24 cm²"
                                    }
                                ]
                            },
                            {
                                name: "cercle",
                                properties: {
                                    center: true,
                                    radius: true,
                                    diameter: true
                                },
                                interactive: {
                                    change_radius: true,
                                    show_diameter: true,
                                    calculate_circumference: true
                                }
                            }
                        ]
                    },

                    mesures: {
                        title: "Aires et Périmètres",
                        levels: [
                            {
                                shapes: ["rectangle", "carré"],
                                formulas: {
                                    rectangle_area: "longueur × largeur",
                                    rectangle_perimeter: "2 × (longueur + largeur)",
                                    square_area: "côté × côté",
                                    square_perimeter: "4 × côté"
                                },
                                exercises: [
                                    {
                                        shape: "rectangle",
                                        dimensions: { length: 8, width: 5 },
                                        question_area: "Quelle est l'aire ?",
                                        answer_area: 40,
                                        question_perimeter: "Quel est le périmètre ?",
                                        answer_perimeter: 26
                                    }
                                ]
                            }
                        ]
                    }
                }
            },

            // === PROBLÈMES INTERACTIFS ===
            problemes: {
                title: "Résolution de Problèmes",
                icon: "🧩", 
                description: "Situations concrètes avec illustrations",
                categories: {
                    vie_quotidienne: {
                        title: "Vie Quotidienne",
                        problems: [
                            {
                                id: "courses_1",
                                title: "Les Courses de Maman",
                                story: "Maman va faire les courses. Elle achète 3 pommes à 2€ le kilo, 2 pains à 1€ pièce et 1 litre de lait à 1€.",
                                illustration: "🛒🍎🍞🥛",
                                question: "Combien Maman dépense-t-elle en tout ?",
                                steps: [
                                    { text: "Pommes : 3 × 2€ = 6€", calculation: "3 * 2", result: 6 },
                                    { text: "Pains : 2 × 1€ = 2€", calculation: "2 * 1", result: 2 },
                                    { text: "Lait : 1€", calculation: "1", result: 1 },
                                    { text: "Total : 6€ + 2€ + 1€ = 9€", calculation: "6 + 2 + 1", result: 9 }
                                ],
                                answer: 9,
                                unit: "€",
                                difficulty: "facile"
                            },
                            
                            {
                                id: "recreation_1", 
                                title: "Récréation à l'École",
                                story: "Dans la cour de récréation, il y a 24 enfants. 15 jouent au football et les autres jouent aux billes.",
                                illustration: "⚽👥🏫",
                                question: "Combien d'enfants jouent aux billes ?",
                                steps: [
                                    { text: "Total enfants : 24", calculation: "24", result: 24 },
                                    { text: "Football : 15", calculation: "15", result: 15 },
                                    { text: "Billes : 24 - 15 = 9", calculation: "24 - 15", result: 9 }
                                ],
                                answer: 9,
                                unit: "enfants",
                                difficulty: "facile"
                            }
                        ]
                    },

                    mesures_temps: {
                        title: "Temps et Mesures", 
                        problems: [
                            {
                                id: "horloge_1",
                                title: "L'Heure du Goûter",
                                story: "Julie prend son goûter à 16h30. Le goûter dure 20 minutes.",
                                illustration: "🕕🍪⏰",
                                question: "À quelle heure Julie finit-elle son goûter ?",
                                interactive_clock: true,
                                steps: [
                                    { text: "Début : 16h30", time: "16:30" },
                                    { text: "Durée : 20 minutes", duration: 20 },
                                    { text: "Fin : 16h30 + 20min = 16h50", time: "16:50" }
                                ],
                                answer: "16h50",
                                difficulty: "moyen"
                            }
                        ]
                    }
                }
            },

            // === FRACTIONS VISUELLES ===
            fractions: {
                title: "Fractions",
                icon: "🍕",
                description: "Fractions avec représentations visuelles",
                concepts: {
                    introduction: {
                        title: "Découverte des Fractions",
                        visuals: [
                            {
                                type: "pizza",
                                fractions: [
                                    { numerator: 1, denominator: 2, visual: "🍕|🍕", description: "1/2 = une moitié" },
                                    { numerator: 1, denominator: 4, visual: "🍕|⬜|⬜|⬜", description: "1/4 = un quart" },
                                    { numerator: 3, denominator: 4, visual: "🍕|🍕|🍕|⬜", description: "3/4 = trois quarts" }
                                ]
                            },
                            {
                                type: "chocolate_bar",
                                fractions: [
                                    { numerator: 2, denominator: 6, visual: "🟫🟫⬜⬜⬜⬜", description: "2/6 = deux sixièmes" },
                                    { numerator: 5, denominator: 8, visual: "🟫🟫🟫🟫🟫⬜⬜⬜", description: "5/8 = cinq huitièmes" }
                                ]
                            }
                        ],
                        exercises: [
                            {
                                type: "recognition",
                                visual: "🍕🍕⬜⬜",
                                question: "Quelle fraction est colorée ?",
                                options: ["1/4", "2/4", "3/4", "4/4"],
                                correct: 1,
                                explanation: "2 parts sur 4 sont colorées, donc 2/4"
                            }
                        ]
                    },

                    comparaison: {
                        title: "Comparer les Fractions",
                        exercises: [
                            {
                                type: "comparison",
                                fractions: ["1/2", "1/4"],
                                visuals: ["🍕🍕|⬜⬜", "🍕|⬜|⬜|⬜"],
                                question: "Quelle fraction est la plus grande ?",
                                answer: "1/2",
                                explanation: "1/2 = 2/4, donc 1/2 > 1/4"
                            }
                        ]
                    }
                }
            }
        };

        this.gameFormats = {
            // Types de jeux interactifs
            speed_challenge: {
                name: "Défi Vitesse",
                description: "Réponds rapidement aux calculs",
                duration: 60, // secondes
                scoring: { correct: 10, speed_bonus: 5, streak_bonus: 2 }
            },
            
            precision_mode: {
                name: "Mode Précision", 
                description: "Pas de limite de temps, vise la perfection",
                hearts: 3,
                scoring: { correct: 15, perfect_streak: 10 }
            },
            
            adventure_mode: {
                name: "Mode Aventure",
                description: "Progresse à travers différents niveaux",
                levels: 10,
                unlock_system: true,
                scoring: { level_complete: 50, perfect_level: 100 }
            }
        };

        this.adaptiveSystem = {
            // Système d'adaptation automatique de difficulté
            difficultyLevels: {
                1: { name: "Très Facile", multiplier: 0.7, timeBonus: 1.5 },
                2: { name: "Facile", multiplier: 0.8, timeBonus: 1.3 },
                3: { name: "Normal", multiplier: 1.0, timeBonus: 1.0 },
                4: { name: "Difficile", multiplier: 1.2, timeBonus: 0.8 },
                5: { name: "Expert", multiplier: 1.5, timeBonus: 0.6 }
            },
            
            adjustmentRules: {
                increaseIf: { successRate: 0.85, avgTime: "fast" },
                decreaseIf: { successRate: 0.4, mistakes: 3 },
                maintainIf: { successRate: 0.6, engagement: "good" }
            }
        };
    }

    // === GÉNÉRATEURS D'EXERCICES ===
    generateSpeedChallenge(operation, level, count = 20) {
        const exercises = [];
        const levelConfig = this.modules.calcul_mental.levels[level];
        const opConfig = levelConfig.operations[operation];
        
        for (let i = 0; i < count; i++) {
            let exercise;
            
            switch (operation) {
                case 'addition':
                    exercise = this.generateAddition(opConfig.range);
                    break;
                case 'multiplication':
                    exercise = this.generateMultiplication(opConfig.tables);
                    break;
                case 'soustraction':
                    exercise = this.generateSoustraction(opConfig.range);
                    break;
                default:
                    exercise = this.generateAddition([1, 10]);
            }
            
            exercises.push(exercise);
        }
        
        return {
            type: "speed_challenge",
            operation,
            level,
            exercises,
            timeLimit: opConfig.timeLimit,
            scoring: this.gameFormats.speed_challenge.scoring
        };
    }

    generateAddition(range) {
        const a = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        const b = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        
        return {
            question: `${a} + ${b}`,
            answer: a + b,
            operands: [a, b],
            operation: '+',
            difficulty: this.calculateDifficulty(a + b)
        };
    }

    generateMultiplication(tables) {
        const table = tables[Math.floor(Math.random() * tables.length)];
        const multiplier = Math.floor(Math.random() * 9) + 1;
        
        return {
            question: `${table} × ${multiplier}`,
            answer: table * multiplier,
            operands: [table, multiplier],
            operation: '×',
            table,
            difficulty: this.calculateDifficulty(table * multiplier)
        };
    }

    generateSoustraction(range) {
        const a = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        const b = Math.floor(Math.random() * a) + 1; // b < a pour éviter négatifs
        
        return {
            question: `${a} - ${b}`,
            answer: a - b,
            operands: [a, b],
            operation: '-',
            difficulty: this.calculateDifficulty(a)
        };
    }

    // === PROBLÈMES CONTEXTUALISÉS ===
    getProblemByCategory(category, difficulty = "facile") {
        const problems = this.modules.problemes.categories[category]?.problems || [];
        return problems.filter(p => p.difficulty === difficulty);
    }

    generateProblemSet(category, count = 5) {
        const allProblems = this.getProblemByCategory(category);
        return this.shuffleArray(allProblems).slice(0, count);
    }

    // === SYSTÈME ADAPTATIF ===
    adjustDifficulty(userPerformance) {
        const { successRate, avgTime, mistakes } = userPerformance;
        const rules = this.adaptiveSystem.adjustmentRules;
        
        if (successRate >= rules.increaseIf.successRate && avgTime < 10) {
            return { action: "increase", reason: "Performance excellente" };
        } else if (successRate <= rules.decreaseIf.successRate || mistakes >= rules.decreaseIf.mistakes) {
            return { action: "decrease", reason: "Difficulté trop élevée" };
        } else {
            return { action: "maintain", reason: "Niveau approprié" };
        }
    }

    // === UTILITAIRES ===
    calculateDifficulty(result) {
        if (result <= 20) return 1;
        if (result <= 50) return 2;
        if (result <= 100) return 3;
        if (result <= 200) return 4;
        return 5;
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // === API PUBLIQUE ===
    getModule(moduleId) {
        return this.modules[moduleId];
    }

    getExerciseConfig(moduleId, type, level) {
        return this.modules[moduleId]?.levels?.[level]?.operations?.[type];
    }

    startGame(moduleId, gameType, config = {}) {
        const module = this.getModule(moduleId);
        if (!module) return null;

        return {
            moduleId,
            gameType,
            config: { ...this.gameFormats[gameType], ...config },
            startTime: Date.now(),
            exercises: this.generateExerciseSet(moduleId, config)
        };
    }

    generateExerciseSet(moduleId, config) {
        // Implémentation spécifique selon le module
        switch (moduleId) {
            case 'calcul_mental':
                return this.generateSpeedChallenge(
                    config.operation || 'addition',
                    config.level || 'debutant',
                    config.count || 20
                );
            default:
                return [];
        }
    }
}

// Instance globale
const mathsDB = new MathsInteractiveDatabase();

// Export
if (typeof window !== 'undefined') {
    window.MathsInteractiveDatabase = MathsInteractiveDatabase;
    window.mathsDB = mathsDB;
}