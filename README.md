[![build][project-travis-ci-image]][project-travis-ci-url]
[![codeclimate][project-codeclimate-image]][project-codeclimate-url]
[![test coverage][project-codeclimate-coverage-image]][project-codeclimate-coverage-url]
[![npm version][project-npm-version]][project-npm-version-url]
[![npm dependencies][project-npm-dependencies]][project-npm-dependencies-url]
[![npm dev dependencies][project-npm-dev-dependencies]][project-npm-dev-dependencies-url]

# json2neo

A module for turning JSON into Neo4j graphs.

## Quick Start && Examples

```
npm install
```

Simplest possible example:

```
$ echo '{"name":"John", "friends":[{"name":"Bob"}]}' | \
./node_modules/.bin/babel-node src/json2cypher.js --stdin \
  --label Person
CREATE (e0:`friends` {`name`: "Bob" })
CREATE (e2:`Person` {`name`: "John" })
MERGE (e2)-[e1:`friends`]->(e0);
```

Every object is a neo4j node; JSON properties that go to other objects indicate
relationships to other nodes.  It's about that simple.

From there, you'll want to use a mapping file to control how nodes and relationships
are labeled.  

Use a mapping to take a tweet from the streaming API and turn it into a node set.

```
./node_modules/.bin/babel-node src/json2cypher.js --file samples/tweet.json \
     --label Tweet \
     --mapping samples/tweet-mapping.json
```

Convert this repo's package.json into a graph:

```
./node_modules/.bin/babel-node src/json2cypher.js --file package.json \
     --label JavascriptPackage \
     --mapping samples/package-mapping.json
```

## Command Line Options:

```
json2cypher [args]
   --stdin (read JSON data from standard in)
   --file /path/to/file.json (read JSON data from specified file)
   --mapping /path/to/mapping-file.json
   --label MyLabel (Use this label for the root JSON object)
   --multi treat input source as multiple JSON objects, one per line.

   --create output cypher as a set of create operations
   --merge output cypher as a set of merge operations (default)


Produces cypher on standard output.
```

## Mappings

A mapping file is just a JSON file that tells the program how to convert a relationship name
in JSON into either a node label or a relationship type.

For example, if you have JSON like this:

```
{
  "name": "John",
  "friends": [ { "name": "Bob" }, { "name": "Susan" } ]
}
```

You might use a mapping like this:

```
{
  "friends": {
    "label": "Friend",
    "relationshipType": "HAS_FRIEND"
  }
}
```

This would produce a graph where `(John)-[:HAS_FRIEND]->(:Friend { name: "Bob" })`.

By default, the mapping would take the json property name as both the relationship type
and the destination node label.

These mappings are quite simple and have some limitations:

- Renaming is global, so you can't map "friends" one way at the root and another way somewhere else.
- Renaming is static; there's no way to have the label name be the result of a function, for example.

I don't recommend you go too far with these mappings, they're intended to be quite straightforward and simple.  If you need more complex mappings, you might consider using something like the json-mapper module to massage your JSON data before importing it into 
neo4j.

## Keys

For using the `--merge` operation, the program needs to know what the node keys are.
This is specified in the mapping file like this:

```
  "keys": {
    "Tweet": "id_str",
    "User": "screen_name"
  }
```

Consult tweet-mapping.json in samples for an example.

This means that when merging every tweet, duplicates by `id_str` will not be created.

## How to use

1. Clone this repository: `git clone https://github.com/hwndept/node-seed`
2. Remove .git directory
3. Update package.json
  - set "name"
  - set "version"(0.0.0 by default)
  - set "description"
  - set "author"
  - set "license"
  - set right "keywords" or remove this section
  - set your "repository" or remove this section
  - set "bugs" or remove this section
  - set "homepage" or remove this section
4. Update README.md
5. Update .travis.yml to use Travis as CI or remove it.
  **repo_token** used in config is the codeclimate's token.
  Every build on travis will report code coverage value to codeclimate.

## What are included

- Code linter - [eslint][eslint-url];
- Test runner - [mocha][mocha-url];
- Test coverage checker - [istanbul][istanbul-url];
- Task manager - [gulp][gulp-url];
- Pre-commit hook;
- JsDoc generation - [jsdoc][jsdoc-url];
- ES6 Support([ECMA-262, Edition 5][ecma-262-edition-5-url]) - [babel][babel-url];
- Codeclimate integration [codeclimate][codeclimate-url];
- TravisCI integration [travis-ci][travis-ci-url];
- Editor Config [editorconfig][editor-config-url];
- List all available tasks using `gulp help` command;

## Linting

```bash
gulp lint
```

Code that will be validated:

- all **\*.js** files in **src** folder
- all **\*.js** files in **test** folder
- **gulpfile.js**

## Running tests and generating code coverage report

```bash
gulp test
```

Test cases stored in files **test/\*\*/\*.test.js** will be run only

Coverage reports will be generated and stored in folder **.build/coverage**

## Generating jsdoc

```bash
gulp jsdoc
```

Documentation will be generated for **\*.js** files from **src** folder and stored in folder **.build/jsdoc**

## Compiling code - ES6 Support

Since **nodejs** doesn't fully support all ES6 features source code should be compiled.

```bash
gulp compile
```

Source code in **src** folder will be compiled and stored in folder **.build/source**

## Running all tasks

```bash
gulp
# or
gulp build
```

## Pre-commit hook

This hook is invoked by **git commit**, and can be bypassed with **--no-verify** option.

The task **gulp build** will be run automatically.

## Printing all available tasks and theirs arguments

```bash
gulp help
```

## Directory Layout

```
  .build/                  --> build results
    coverage              --> code coverage reports
    jsdoc                 --> documentation generated for source code
    source                --> copy of the project but with transpiled code
  config/
    confih.yml            --> application configuration file
  src/                    --> source files for the application
    services/
      config.js           --> configuration module
    hello.js              --> added just for an example
  test/                   --> test files for the application
    integration/          --> integration tests
    unit/                 --> unit tests
    .eslintrc             --> configuration file for eslint; these rules
                              will be applied for files in this folder
                              only; created because test cases contain
                              global functions which exports by
                              mocha(describe, it, beforeEach, etc)
  .codeclimate.yml        --> configuration file for codeclimate
  .editorconfig           --> configuration file for code editors to keep style
  .eslintrc               --> configuration file for eslint
  .travis.yml             --> configuration file for travis-ci
  gulpfile.js             --> list of all gulp tasks
```

[project-travis-ci-image]: https://travis-ci.org/hwndept/node-seed.svg?branch=master
[project-travis-ci-url]: https://travis-ci.org/hwndept/node-seed
[project-codeclimate-image]: https://codeclimate.com/github/hwndept/node-seed/badges/gpa.svg
[project-codeclimate-url]: https://codeclimate.com/github/hwndept/node-seed
[project-codeclimate-coverage-image]: https://codeclimate.com/github/hwndept/node-seed/badges/coverage.svg
[project-codeclimate-coverage-url]: https://codeclimate.com/github/hwndept/node-seed/coverage
[project-npm-version]: https://img.shields.io/npm/v/node-seed.svg
[project-npm-version-url]: https://www.npmjs.com/package/node-seed
[project-npm-dependencies]: https://david-dm.org/hwndept/node-seed/status.svg
[project-npm-dependencies-url]: https://david-dm.org/hwndept/node-seed
[project-npm-dev-dependencies]: https://david-dm.org/hwndept/node-seed/dev-status.svg
[project-npm-dev-dependencies-url]: https://david-dm.org/hwndept/node-seed#info=devDependencies&view=table
[eslint-url]: http://eslint.org
[mocha-url]: http://mochajs.org/
[istanbul-url]: https://github.com/gotwarlost/istanbul/
[gulp-url]: http://gulpjs.com/
[jsdoc-url]: http://usejsdoc.org/
[ecma-262-edition-5-url]: http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf
[babel-url]: https://babeljs.io/
[codeclimate-url]: https://codeclimate.com/
[travis-ci-url]: https://travis-ci.org/
[editor-config-url]: http://editorconfig.org/
