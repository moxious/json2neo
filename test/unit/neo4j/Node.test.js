import assert from 'assert';
import Node from '../../../src/neo4j/Node';
import JSONMapping from '../../../src/mapping/JSONMapping';
import GraphEntitySet from '../../../src/neo4j/GraphEntitySet';

describe('Node', () => {
  let mapping, set;

  beforeEach(() => {
    mapping = new JSONMapping({
      keys: {
        Foo: 'x',
      }
    });

    set = new GraphEntitySet(mapping);
  });

  it('should store properties', () => {
    const n = new Node({ properties: { x: 1 } });
    assert.equal(n.getProperties().x, 1);
  });

  it('should escape labels in create cypher', () => {
    const n = new Node({ label: 'Foo' });
    const cypher = n.createCypher();

    assert.notEqual(cypher.indexOf('`Foo`'), -1);
  });

  it('should generate cypher correctly', () => {
    const n = new Node({ label: 'Foo', properties: { x: 1 } });
    const cypher = n.createCypher('e0', set);
    console.log(cypher);
    assert.equal(cypher, 'CREATE (e0:`Foo` {`x`: 1 })');
  });

  it('should generate merge cypher correctly', () => {
    const n = new Node({ label: 'Foo', properties: { x: 1, b: 2 } });
    const cypher = n.mergeCypher('e0', set).replace(/\s+/g, ' ').replace(/\s+$/, '');
    console.log(cypher);
    assert.equal(cypher, 'MERGE (e0:`Foo` { `x`: 1 }) ON CREATE SET e0.`b`= 2');
  });
});
