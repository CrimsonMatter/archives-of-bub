import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bub: {
          void: '#0f0e0d',
          soot: '#1a1816',
          leather: '#3e3228',
          brass: '#b08d55',
          gold: '#d4af37',
          parchment: '#dcd6c6',
          vellum: '#e8e4d9',
          ink: '#2b2622',
          faded: '#8a847c',
          moss: '#4a5d4a',
          dust: 'rgba(220, 214, 198, 0.1)',
        }
      },
      fontFamily: {
        serif: ['"Crimson Text"', 'Georgia', '"Times New Roman"', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Courier Prime"', 'Courier', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.bub.ink'),
            fontFamily: theme('fontFamily.serif'),
            h1: {
              fontFamily: theme('fontFamily.display'),
              fontWeight: '700',
              color: theme('colors.bub.soot'),
            },
            h2: {
              fontFamily: theme('fontFamily.display'),
              color: theme('colors.bub.leather'),
              marginTop: '2em',
              marginBottom: '1em',
            },
            h3: {
              fontFamily: theme('fontFamily.display'),
              color: theme('colors.bub.leather'),
            },
            blockquote: {
              borderLeftColor: theme('colors.bub.brass'),
              fontStyle: 'italic',
              color: theme('colors.bub.leather'),
              backgroundColor: 'rgba(176, 141, 85, 0.05)',
              padding: '1rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              fontFamily: theme('fontFamily.mono'),
              fontWeight: '400',
              color: theme('colors.bub.leather'),
            },
          },
        },
        bub: {
          css: {
            '--tw-prose-body': theme('colors.bub.parchment'),
            '--tw-prose-headings': theme('colors.bub.brass'),
            '--tw-prose-lead': theme('colors.bub.faded'),
            '--tw-prose-links': theme('colors.bub.gold'),
            '--tw-prose-bold': theme('colors.bub.parchment'),
            '--tw-prose-counters': theme('colors.bub.faded'),
            '--tw-prose-bullets': theme('colors.bub.brass'),
            '--tw-prose-hr': theme('colors.bub.leather'),
            '--tw-prose-quotes': theme('colors.bub.parchment'),
            '--tw-prose-quote-borders': theme('colors.bub.brass'),
            '--tw-prose-captions': theme('colors.bub.faded'),
            '--tw-prose-code': theme('colors.bub.parchment'),
            '--tw-prose-pre-code': theme('colors.bub.parchment'),
            '--tw-prose-pre-bg': theme('colors.bub.soot'),
            '--tw-prose-th-borders': theme('colors.bub.leather'),
            '--tw-prose-td-borders': theme('colors.bub.leather'),
          },
        },
      }),
      backgroundImage: {
        'dust-gradient': 'radial-gradient(circle, rgba(220, 214, 198, 0.03) 1px, transparent 1px)',
        'vignette': 'radial-gradient(circle, transparent 60%, rgba(15, 14, 13, 0.8) 100%)',
      },
      animation: {
        'settle': 'settle 1.5s ease-out forwards',
        'flicker': 'flicker 4s infinite',
      },
      keyframes: {
        settle: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.97' },
        }
      }
    },
  },
  plugins: [
    typography,
  ],
}