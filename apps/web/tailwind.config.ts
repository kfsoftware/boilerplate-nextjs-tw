// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";
import path from "path";

const content = [
  path.join(path.dirname(require.resolve('@repo/ui')), '**/*.{ts,tsx}'),
  '../../packages/ui/src/components/**/*.{ts.tsx}',
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
]
const config: Pick<Config, "content" | "presets"> = {
  content,
  presets: [sharedConfig],
};

export default config;