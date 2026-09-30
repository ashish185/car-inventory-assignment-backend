import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Reads the SDL file at runtime. The build script copies vehicle-make.schema.graphql
 * next to the compiled JS in dist/modules/vehicle-make so this works in both
 * dev (ts-node) and the compiled build.
 */
export function loadTypeDefs(): string {
  return readFileSync(
    join(__dirname, '..', 'modules', 'vehicle-make', 'vehicle-make.schema.graphql'),
    'utf-8',
  );
}
