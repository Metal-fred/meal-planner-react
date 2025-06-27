// postcss.config.cjs
module.exports = {
  plugins: [
    // 👇 Nuevo plugin que “conecta” Tailwind v4 con PostCSS
    require('@tailwindcss/postcss')({
      // (opcional) activa la compatibilidad futura:
      // future: { relativeContentPaths: true }
    }),
    require('autoprefixer'),
  ],
};
