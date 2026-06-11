import path from "path"
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // El plugin de Tailwind v4 para Vite
    tailwindcss(),
    // React con el preset del compilador
    react(),
    // Babel para procesar el compilador de React
    babel({ 
      presets: [reactCompilerPreset()] 
    })
  ],
  resolve: {
    alias: {
      // Configuración de alias para usar "@/" en tus imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
})