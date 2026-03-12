/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Configuración de tipografías importadas de Google Fonts
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
        title: ['Montserrat', 'sans-serif'], 
      },
      // Paleta de colores personalizada (Tema Oscuro - Shadboard)
      colors: {
        fondo: '#09090b',       // Fondo principal oscuro
        tarjeta: '#18181b',     // Fondo para contenedores y paneles
        borde: '#27272a',       // Color para líneas divisorias y bordes
        primario: '#fafafa',    // Texto principal de alto contraste
        secundario: '#a1a1aa',  // Texto descriptivo y elementos inactivos
        acento: '#ffffff',      // Elementos interactivos y botones
      }
    },
  },
  plugins: [],
}