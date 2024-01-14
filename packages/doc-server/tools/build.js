import esbuild from 'esbuild';
import dotenv from 'dotenv';

const phase = process.env.PHASE;

if (!phase) {
  throw new Error('PHASE is not defined');
}

const config = dotenv.config({
  path: `config/.env.${phase}`,
});

esbuild.build({
  entryPoints: ['./src/index.ts'],
  outdir: 'dist',
  outExtension: {
    '.js': '.mjs',
  },
  bundle: true,
  external: ['@prisma/client'],
  platform: 'node',
  target: 'node20',
  format: 'esm',
  tsconfig: './tsconfig.json',
  define: Object.fromEntries(
    Object.entries(config.parsed).map(([key, value]) => [
      `process.env.${key}`,
      JSON.stringify(value),
    ]),
  ),
  banner: {
    js: `
      const require = (await import("node:module")).createRequire(import.meta.url);
      const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
      const __dirname = (await import("node:path")).dirname(__filename);
    `,
  },
});
