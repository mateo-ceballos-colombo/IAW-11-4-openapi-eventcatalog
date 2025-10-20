#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.error('Uso: npm run scaffold:event <NombreEvento>');
    process.exit(1);
  }
  const baseDir = path.join(process.cwd(), 'eventcatalog', 'events', name);
  await fs.mkdir(baseDir, { recursive: true });
  const readmePath = path.join(baseDir, 'README.md');
  if (await exists(readmePath)) {
    console.error('El evento ya existe:', name);
    process.exit(1);
  }
  const template = await fs.readFile(path.join(process.cwd(), 'eventcatalog','events','_template','README.md'), 'utf-8');
  const content = template.replace(/<NombreEvento>/g, name);
  await fs.writeFile(readmePath, content, 'utf-8');
  console.log('Evento creado en', readmePath);
}

async function exists(p){try{await fs.access(p);return true;}catch{return false;}}

main().catch(e=>{console.error(e);process.exit(1);});
