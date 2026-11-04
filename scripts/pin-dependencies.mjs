import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
for (const section of ['dependencies', 'devDependencies']) {
  for (const name of Object.keys(manifest[section])) {
    manifest[section][name] = lock.packages[`node_modules/${name}`].version;
    lock.packages[''][section][name] = manifest[section][name];
  }
}
fs.writeFileSync('package.json', JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
