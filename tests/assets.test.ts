import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { heroImage, properties } from '../src/data';
describe('Submission assets and hosting configuration', () => {
  for (const property of properties) {
    it(`${property.name} includes three distinct local Sri Lankan photos`, () => {
      const images = [property.image, ...property.gallery];
      expect(images).toHaveLength(3);
      expect(new Set(images).size).toBe(3);
      for (const image of images) {
        expect(image).toMatch(/^\/images\/srilanka\//);
        const file = path.join(process.cwd(), 'public', image);
        expect(existsSync(file)).toBe(true);
        expect(readFileSync(file).length).toBeGreaterThan(10000);
      }
    });
  }
  it('bundles the Sri Lankan hero photo', () =>
    expect(existsSync(path.join(process.cwd(), 'public', heroImage))).toBe(true));
  it('records source, creator and reusable licence for every displayed photograph', () => {
    const credits = JSON.parse(readFileSync('public/images/srilanka/metadata.json', 'utf8'));
    const displayed = new Set([heroImage, ...properties.flatMap((p) => [p.image, ...p.gallery])]);
    for (const image of displayed) {
      const record = credits.find(
        (entry: { file: string }) => entry.file === image.split('/').pop(),
      );
      expect(record, image).toBeDefined();
      expect(record.source).toMatch(/^https:\/\/commons.wikimedia.org\//);
      expect(record.artist.length).toBeGreaterThan(0);
      expect(record.licence).toMatch(/^CC/);
      expect(record.licenceUrl).toContain('creativecommons.org');
    }
  });
  it('configures Vercel as a Vite static build', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
    expect(config.framework).toBe('vite');
    expect(config.outputDirectory).toBe('dist');
    expect(config.installCommand).toBe('npm ci');
  });
  it('excludes local runtime and output archives from Git', () => {
    const ignore = readFileSync('.gitignore', 'utf8');
    expect(ignore).toContain('.tools/');
    expect(ignore).toContain('outputs/');
    expect(ignore).toContain('node_modules/');
  });
});
