import tailwindTypography from '@tailwindcss/typography';
import tailwindDracula from 'tailwind-dracula';

export default {
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.50'),
            a: {
              color: theme('colors.gray.50'),
            },
            h2: {
              a: {
                color: theme('colors.indigo.400'),
              },
            },
            h3: {
              color: theme('colors.green'),
              a: {
                color: theme('colors.green'),
              },
            },
          },
          tag: {
            color: theme('colors.green'),
            a: {
              color: theme('colors.green'),
            },
          },
        },
      }),
    },
  },
  plugins: [tailwindDracula(), tailwindTypography],
};
