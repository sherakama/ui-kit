import {readdirSync} from 'node:fs';
import {promisify} from 'util';
import {execute} from '../../../scripts/exec.mjs';

const dir = './config/api-extractor';

async function main() {
  const paths = readdirSync(dir)
    .filter((file) => file !== 'base.json')
    .map((file) => `${dir}/${file}`);
  console.log('extracting documentation using', paths);

  const jobs = paths.map((path) =>
    execute('api-extractor', ['run', '-l', '-c', path])
  );
  await Promise.all(jobs);
}

main();
