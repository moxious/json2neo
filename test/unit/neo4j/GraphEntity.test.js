import assert from 'assert';
import GraphEntity from '../../../src/neo4j/GraphEntity';

describe('GraphEntity', () => {
  describe('Cypher Primitive', () => {
    let ge;

    before(() => {
      ge = new GraphEntity({});
    });

    it('should create safe cypher identifiers', () => {
      assert.equal(ge.cypherIdentifier('foo'), '`foo`');
      assert.equal(ge.cypherIdentifier('foo`'), '`foo\\``');
    });

    it('should primitive strings', () => {
      assert.equal(ge.cypherPrimitive('foo'), '"foo"');
      assert.equal(ge.cypherPrimitive('foo"bar"'), '"foo\\"bar\\""');
    });

    it('should primitive booleans', () => {
      assert.equal(ge.cypherPrimitive(true), true);
      assert.equal(ge.cypherPrimitive(false), false);
    });

    it('should primitive numbers', () => {
      assert.equal(ge.cypherPrimitive(0), 0);
      assert.equal(ge.cypherPrimitive(3.1415), 3.1415);
    });

    it('should turn undef, null, and NaN into null', () => {
      assert.equal(ge.cypherPrimitive(undefined), "null");
      assert.equal(ge.cypherPrimitive(null), "null");
      assert.equal(ge.cypherPrimitive(NaN), "null");
    });
  });
});
