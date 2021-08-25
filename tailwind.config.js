import tailwindTypography from '@tailwindcss/typography';
import tailwindDracula from 'tailwind-dracula';

export default {
  purge: {
    content: [
      './components/**/*.vue',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './content/**/*.md',
    ],
  },
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.50'),
            a: {
              color: theme('colors.pink'),
            },
            h1: {
              color: theme('colors.indigo.300'),
              fontWeight: 600,
              a: {
                color: theme('colors.indigo.300'),
              },
            },
            h2: {
              color: theme('colors.green'),
              fontWeight: 400,
              a: {
                color: theme('colors.pink'),
              },
            },
            h3: {
              color: theme('colors.pink'),
              a: {
                color: theme('colors.pink'),
              },
            },
            code: {
              backgroundColor: theme('colors.orange'),
              color: theme('colors.gray.900'),
              fontWeight: '600',
              borderRadius: theme('borderRadius.DEFAULT'),
            },
            blockquote: {
              backgroundColor: theme('colors.indigo.700'),
              color: theme('colors.white'),
            },
            '.toc': {
              a: {
                textDecoration: 'none',
                color: theme('colors.gray.800'),
              },
            },
            '.tag': {
              color: theme('colors.gray.800'),
            },
            strong: {
              color: theme('colors.orange'),
            },
          },
        },
        sm: {
          css: {
            color: theme('colors.gray.50'),
            a: {
              color: theme('colors.pink'),
            },
            h1: {
              color: theme('colors.indigo.300'),
              fontWeight: 600,
              a: {
                color: theme('colors.indigo.300'),
              },
            },
            h2: {
              color: theme('colors.green'),
              fontWeight: 400,
              a: {
                color: theme('colors.pink'),
              },
            },
            h3: {
              color: theme('colors.pink'),
              a: {
                color: theme('colors.pink'),
              },
            },
            code: {
              backgroundColor: theme('colors.orange'),
              color: theme('colors.gray.900'),
              fontWeight: '600',
              borderRadius: theme('borderRadius.DEFAULT'),
            },
            blockquote: {
              backgroundColor: theme('colors.indigo.700'),
              color: theme('colors.white'),
            },
          },
        },
      }),
    },
  },
  plugins: [tailwindTypography, tailwindDracula()],
};
