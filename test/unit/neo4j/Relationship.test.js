import assert from 'assert';
import Node from '../../../src/neo4j/Node';
import GraphEntitySet from '../../../src/neo4j/GraphEntitySet';
import Relationship from '../../../src/neo4j/Relationship';

describe('Relationship', () => {
  let n1, n2, r, set;

  beforeEach(() => {
    n1 = new Node({ label: 'Foo' });
    n2 = new Node({ label: 'Foo' });
    r = new Relationship({ from: n1, to: n2, type: 'foo' });
    set = new GraphEntitySet();

    set.addNode(n1);
    set.addNode(n2);
    set.addRelationship(r);
  });

  it('does not allow missing from/to', () => {
    assert.throws(() => new Relationship({ from: n1, type: 'foo' }), Error);
    assert.throws(() => new Relationship({ to: n2, type: 'foo' }), Error);
  });

  it('does not allow missing type', () => {
    assert.throws(() => new Relationship({ from: n1, to: n2 }), Error);
  });

  it('should escape labels in create cypher', () => {
    const cypher = r.createCypher(set);
    assert.notEqual(cypher.indexOf('`foo`'), -1);
  });
});
