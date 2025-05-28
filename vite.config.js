import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// Fonction pour trouver automatiquement tous les fichiers HTML
function getHtmlEntries() {
  const entries = {};
  
  // Parcourir le répertoire racine
  const files = readdirSync('./');
  
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '');
      entries[name] = resolve(__dirname, file);
    }
  });
  
  // Ajouter les sections spécifiques
  const sections = ['villes', 'carte_europe'];
  sections.forEach(section => {
    try {
      const sectionFiles = readdirSync(`./${section}`);
      sectionFiles.forEach(file => {
        if (file.endsWith('.html')) {
          const name = `${section}_${file.replace('.html', '')}`;
          entries[name] = resolve(__dirname, section, file);
        }
      });
    } catch (e) {
      // Le dossier n'existe pas, on continue
    }
  });
  
  return entries;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    
    // Optimisation pour réduire la taille des bundles
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        // Séparer les vendors
        manualChunks: {
          'alpine': ['alpinejs'],
          'charts': ['chart.js'],
          'pdf': ['jspdf'],
          'data': ['xlsx', 'papaparse']
        },
        
        // Noms de fichiers optimisés
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          } else if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          } else if (ext === 'css') {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Limite de taille pour les avertissements
    chunkSizeWarningLimit: 1000
  },
  
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  
  server: {
    port: 5173,
    host: true, // Pour accès réseau local
    open: true, // Ouvre automatiquement le navigateur
    
    // Configuration pour le développement
    watch: {
      usePolling: true // Pour Windows
    }
  },
  
  // Optimisations
  optimizeDeps: {
    include: ['alpinejs', 'chart.js']
  },
  
  // Alias pour imports simplifiés
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@styles': resolve(__dirname, './styles'),
      '@scripts': resolve(__dirname, './scripts'),
      '@assets': resolve(__dirname, './assets')
    }
  }
});
