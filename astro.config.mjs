// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'

// `astro build`, `astro check` and `astro sync` start their own Vite and re-bundle dependencies. If
// they share a cache folder with a running dev server, the files change underneath it, the browser
// ends up with two copies of React and islands (the services accordion, for one) crash on hydrate.
// Giving the dev server its own cache folder keeps the two apart.
const isDevServer = process.argv.includes('dev')

export default defineConfig({
  site: process.env.SITE_URL || 'https://hashimaziz46.github.io/',
  integrations: [
    react(),
    mdx(),
    // Writes sitemap-index.xml and sitemap-0.xml at build time; robots.txt points crawlers to it
    sitemap({
      filter: page => !page.endsWith('/404/'),
      lastmod: new Date(),
      serialize(item) {
        const path = new URL(item.url).pathname

        if (path === '/') {
          item.priority = 1.0
        } else if (path.startsWith('/case-study/')) {
          item.priority = 0.8
        } else {
          item.priority = 0.5
        }

        // @ts-expect-error - Valid sitemap changefreq value
        item.changefreq = 'monthly'

        return item
      }
    })
  ],
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    cacheDir: isDevServer ? 'node_modules/.vite-dev' : 'node_modules/.vite',
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: 'esbuild'
    },
    ssr: {
      noExternal: ['@radix-ui/*']
    },

    // Vite serves pre-bundled deps as immutable for a year under a version tag that only changes
    // with the config. Rebuilding node_modules/.vite keeps the tag but changes the files behind
    // it, so a browser with the old copies cached loads a second React and islands stop
    // hydrating. Dev-only: make the browser revalidate instead.
    server: {
      headers: { 'Cache-Control': 'no-cache' }
    },

    // Pre-bundle every client-side dependency up front so Vite never re-optimizes mid-session — a
    // mid-session re-optimize swaps in a new module instance with a fresh React context, which
    // makes IdCard's Band throw "Hooks can only be used within the Canvas component!" and leaves
    // open tabs requesting stale chunks (504 Outdated Optimize Dep), so islands fail to hydrate.
    // Add any new package imported by a hydrated component here.
    optimizeDeps: {
      include: [
        '@base-ui/react/accordion',
        '@base-ui/react/avatar',
        '@base-ui/react/button',
        '@base-ui/react/input',
        '@base-ui/react/merge-props',
        '@base-ui/react/scroll-area',
        '@base-ui/react/select',
        '@base-ui/react/separator',
        '@base-ui/react/tabs',
        '@base-ui/react/tooltip',
        '@base-ui/react/use-render',
        '@hookform/resolvers/zod',
        '@react-three/drei',
        '@react-three/fiber',
        '@react-three/rapier',
        'astro/virtual-modules/transitions-events.js',
        'astro/virtual-modules/transitions-router.js',
        'astro/virtual-modules/transitions-swap-functions.js',
        'astro/virtual-modules/transitions-types.js',
        'class-variance-authority',
        'clsx',
        'date-fns',
        'lucide-react',
        'motion/react',
        'react',
        'react-day-picker',
        'react-dom',
        'react-dom/client',
        'react-hook-form',
        'react/jsx-dev-runtime',
        'react/jsx-runtime',
        'sonner',
        'tailwind-merge',
        'three',
        'zod'
      ]
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
})
