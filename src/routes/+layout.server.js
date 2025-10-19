import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
);

export function load() {
  return {
    siteConfig: {
      version: pkg.version
    }
  };
}
