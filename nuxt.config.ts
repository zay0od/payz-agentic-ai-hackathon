// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],


  runtimeConfig: {
    // Private keys are only available on the server
    groqApiKey: process.env.GROQ_API_KEY,
  }
})