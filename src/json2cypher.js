import json2neo from './index';
import yargs from 'yargs';
import fs from 'fs';
import JSONMapping from './mapping/JSONMapping';
import getStdin from 'get-stdin';
import readline from 'readline';

const help = () => {
  console.log(`
json2cypher [args]
   --stdin (read JSON data from standard in)
   --file /path/to/file.json (read JSON data from specified file)
   --mapping /path/to/mapping-file.json
   --label MyLabel (Use this label for the root JSON object)

   --create output cypher as a set of create operations
   --merge output cypher as a set of merge operations (default)

   --multi treat input source as multiple JSON objects, one per line.
Produces cypher on standard output.
`);
  process.exit(1);
};

const initMapping = () => {
  let mappingData = {};

  if (yargs.argv.mapping) {
    try {
      const data = fs.readFileSync(yargs.argv.mapping);
      mappingData = JSON.parse(data);
    } catch (e) {
      console.error('Bad mapping data or file provided');
      console.error(e);
      process.exit(1);
    }
  }

  return new JSONMapping(mappingData);
};

const main = () => {
  if (yargs.argv.help) {
    help();
  }

  let operation = 'merge';

  if (yargs.argv.create) {
    operation = 'create';
  }

  const mapping = initMapping();

  const onRawJSONObject = obj => {
    const cache = json2neo(obj, yargs.argv.label, mapping);
    console.log(cache.cypher(operation));
  };

  if (yargs.argv.stdin) {
    if (yargs.argv.multi) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      });

      rl.on('line', line => line ? onRawJSONObject(JSON.parse(line)) : null);
    } else {
      getStdin()
        .then(rawData => onRawJSONObject(JSON.parse(rawData)))
        .catch(err => console.error('Failed to parse input data', err));
    }
  } else {
    if (yargs.argv.multi) {
      const rl = readline.createInterface({
        input: fs.createReadStream(yargs.argv.file),
        output: process.stdout,
        terminal: false,
      });

      rl.on('line', line => line ? onRawJSONObject(JSON.parse(line)) : null);
    } else {
      const data = fs.readFileSync(yargs.argv.file);
      onRawJSONObject(JSON.parse(data));
    }
  }
};

main();


