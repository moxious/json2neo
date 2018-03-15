import assert from 'assert';
import Node from '../../../src/neo4j/Node';

describe('Node', () => {
  it('should store properties', () => {
    const n = new Node({ properties: { x: 1 } });
    assert.equal(n.getProperties().x, 1);
  });

  it('should escape labels in create cypher', () => {
    const n = new Node({ label: 'Foo' });
    const cypher = n.createCypher();

    assert.notEqual(cypher.indexOf('`Foo`'), -1);
  });
});
