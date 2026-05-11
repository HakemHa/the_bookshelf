import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Replace 'the-bookshelf' below with your actual GitHub repo name.
  // If your repo is github.com/yourname/the-bookshelf, set base to '/the-bookshelf/'
  // If you're using a custom domain or a user/org page (yourname.github.io), set base to '/'
  base: '/the_bookshelf/',
})
