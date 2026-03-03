import { defineConfig } from 'vitepress'
import { shared } from './config/shared'
import { en } from './config/en'
import { ru } from './config/ru'
import { es } from './config/es'
import { kz } from './config/kz'
import { tj } from './config/tj'

export default defineConfig({
  ...shared,
  locales: {
    root: { label: 'English', ...en },
    ru: { label: 'Русский', ...ru },
    es: { label: 'Español', ...es },
    kz: { label: 'Қазақша', ...kz },
    tj: { label: 'Тоҷикӣ', ...tj },
  },
  vite: {
    server: {
      allowedHosts: ['docs.hitkey.local'],
    },
  },
})
