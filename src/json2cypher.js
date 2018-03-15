import json2neo from './index';
import yargs from 'yargs';
import fs from 'fs';
import JSONMapping from './mapping/JSONMapping';

if (!yargs.argv.file || !yargs.argv.label) {
  throw new Error('Call me with --file /path/to/json --label NodeLabel');
}

const data = fs.readFileSync(yargs.argv.file);
const obj = JSON.parse(data);

let mappingData = {};

if (yargs.argv.mapping) {
  try {
    const data = fs.readFileSync(yargs.argv.mapping);
    mappingData = JSON.parse(data);
  } catch(e) {
    console.error('Bad mapping data or file provided');
    console.error(e);
    process.exit(1);
  }
}

let mapping = new JSONMapping(mappingData);
const cache = json2neo(obj, yargs.argv.label, mapping);
console.log(cache.cypher());


