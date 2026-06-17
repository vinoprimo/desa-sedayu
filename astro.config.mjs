import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://desa-sedayu.pages.dev',
  devToolbar: {
    enabled: false,
  },
  vite: {
    optimizeDeps: {
      exclude: ['aria-query', 'axobject-query'],
    },
    plugins: [
      {
        name: 'strip-dev-toolbar-a11y-prebundle',
        configResolved(config) {
          config.optimizeDeps.include = config.optimizeDeps.include?.filter(
            (entry) => (
              !entry.includes('aria-query')
              && !entry.includes('axobject-query')
              && !entry.includes('dev-toolbar')
            ),
          );
        },
      },
    ],
  },
});
