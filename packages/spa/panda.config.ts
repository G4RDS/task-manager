import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

const globalCss = defineGlobalStyles({
  'html, body': {
    height: '100%',
    color: 'token(colors.text.base)',
    fontSize: '16px',
    lineHeight: '1.5em',
    fontFamily:
      'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Hiragino Sans GB", メイリオ, Meiryo, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
    WebkitFontSmoothing: 'auto',
  },
  a: {
    color: '#0284c7',
    textDecoration: 'none',
  },
});

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  gitignore: true,
  globalCss,
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: {
            50: { value: '#f0f9ff' },
            100: { value: '#e0f2fe' },
            200: { value: '#bae6fd' },
            300: { value: '#7dd3fc' },
            400: { value: '#38bdf8' },
            500: { value: '#0ea5e9' },
            600: { value: '#0284c7' },
            700: { value: '#0369a1' },
            800: { value: '#075985' },
            900: { value: '#0c4a6e' },
            alpha50: { value: 'rgba(14, 165, 233, 0.5)' },
          },
          gray: {
            50: { value: '#f8fafc' },
            100: { value: '#f1f5f9' },
            200: { value: '#e2e8f0' },
            300: { value: '#cbd5e1' },
            400: { value: '#94a3b8' },
            500: { value: '#64748b' },
            600: { value: '#475569' },
            700: { value: '#334155' },
            800: { value: '#1e293b' },
            900: { value: '#0f172a' },
            alpha50: { value: 'rgba(100, 116, 139, 0.5)' },
          },
          red: {
            50: { value: '#FEF2F2' },
            100: { value: '#FEE2E2' },
            200: { value: '#FECACA' },
            300: { value: '#FCA5A5' },
            400: { value: '#F87171' },
            500: { value: '#EF4444' },
            600: { value: '#DC2626' },
            700: { value: '#B91C1C' },
            800: { value: '#991B1B' },
            900: { value: '#7F1D1D' },
            alpha50: { value: 'rgba(239, 68, 68, 0.5)' },
          },
          blue: {
            50: { value: '#f0f9ff' },
            100: { value: '#e0f2fe' },
            200: { value: '#bae6fd' },
            300: { value: '#7dd3fc' },
            400: { value: '#38bdf8' },
            500: { value: '#0ea5e9' },
            600: { value: '#0284c7' },
            700: { value: '#0369a1' },
            800: { value: '#075985' },
            900: { value: '#0c4a6e' },
            alpha50: { value: 'rgba(14, 165, 233, 0.5)' },
          },
          green: {
            50: { value: '#f0fdf4' },
            100: { value: '#dcfce7' },
            200: { value: '#bbf7d0' },
            300: { value: '#86efac' },
            400: { value: '#4ade80' },
            500: { value: '#22c55e' },
            600: { value: '#16a34a' },
            700: { value: '#15803d' },
            800: { value: '#166534' },
            900: { value: '#14532d' },
            alpha50: { value: 'rgba(34, 197, 94, 0.5)' },
          },
        },
        easings: {
          easeInOut: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
          easeOut: { value: 'cubic-bezier(0.0, 0, 0.2, 1)' },
          easeIn: { value: 'cubic-bezier(0.4, 0, 1, 1)' },
          sharp: { value: 'cubic-bezier(0.4, 0, 0.6, 1)' },
        },
      },
      semanticTokens: {
        colors: {
          text: {
            dark: { value: '{colors.gray.900}' },
            base: { value: '{colors.gray.700}' },
            light: { value: '{colors.gray.500}' },
          },
          border: {
            image: { value: 'rgba(0, 0, 0, 0.05)' },
          },
        },
      },
    },
  },
  utilities: {
    extend: {
      ellipsis: {
        className: 'ellipsis',
        values: ['1', '2', '3', '4', '5'] as const,
        transform: (value: number) =>
          value === 1
            ? {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }
            : {
                display: '-webkit-box',
                '-webkit-box-orient': 'vertical',
                '-webkit-line-clamp': `${value}`,
                overflow: 'hidden',
              },
      },
    },
  },
});
