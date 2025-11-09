// vite.config.js - Configuration optimisée pour Le Monde des Curieux
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  base: '/',
  
  // Configuration optimisée pour le développement
  server: {
    port: 3000,
    open: true,
    host: true // Permet l'accès depuis d'autres appareils (tablettes de test)
  },
  
  // Configuration de build production
  build: {
    outDir: 'dist',
    sourcemap: true, // Pour le debugging
    
    rollupOptions: {
      input: {
        // Pages principales existantes
        main: 'index.html',
        dashboard: 'dashboard-alpine.html',
        
        // Nouvelles pages gamifiées prioritaires Phase 1
        englishDuolingo: 'english_duolingo_style.html',
        frenchGamified: 'french_gamified.html',
        mathsInteractive: 'maths_interactive.html',
        
        // Pages sections existantes à migrer progressivement
        englishSection: 'english_section.html',
        mathsSection: 'maths_section.html',
        sciencesSection: 'sciences_section.html',
        programmationSection: 'programmation_section.html',
        
        // Pages aventures thématiques
        aventureSpatiale: 'aventure_spatiale.html',
        mysteresOceans: 'mysteres_oceans.html'
      },
      
      // Optimisation des chunks pour performance mobile
      output: {
        manualChunks: {
          // Chunk Alpine.js et composants réutilisables
          'alpine-framework': ['alpinejs'],
          
          // Chunk mécaniques gamification
          'gamification': [
            './scripts/english-streaks.js',
            './scripts/english-hearts.js',
            './scripts/badge-system.js'
          ],
          
          // Chunk visualisations et charts
          'charts': ['chart.js'],
          
          // Chunk utilitaires localStorage
          'storage': ['./scripts/progress-tracker.js']
        }
      }
    },
    
    // Optimisation taille bundle pour tablettes éducatives
    chunkSizeWarningLimit: 500,
    
    // Minification optimisée
    terserOptions: {
      compress: {
        drop_console: true, // Supprime console.log en prod
        drop_debugger: true
      }
    }
  },
  
  // Plugins pour compatibilité et performance
  plugins: [
    legacy({
      targets: [
        'defaults',
        'not IE 11',
        'iOS >= 12', // Support tablettes iPad éducatives
        'Android >= 8' // Support tablettes Android éducatives
      ]
    })
  ],
  
  // Optimisations pour développement local
  optimizeDeps: {
    include: [
      'alpinejs',
      'chart.js'
    ]
  },
  
  // Configuration CSS pour préprocessing
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `
          // Variables globales charte Minecraft
          $primary-color: #2a9d8f;
          $secondary-color: #e9c46a; 
          $accent-color: #e76f51;
          $background-color: #f1faee;
          $text-color: #1d3557;
        `
      }
    }
  }
});