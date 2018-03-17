
import GraphEntitySet from '../../../src/neo4j/GraphEntitySet';
import JSONMapping from '../../../src/mapping/JSONMapping';
import Node from '../../../src/neo4j/Node';
import Relationship from '../../../src/neo4j/Relationship';
import chai from 'chai';

const assert = chai.assert;

describe('GraphEntitySet', () => {
  let set;
  let a, b, rel;

  beforeEach(() => {
    set = new GraphEntitySet(new JSONMapping());
    a = new Node({ label: 'A' });
    b = new Node({ label: 'B' });
    rel = new Relationship({ from: a, to: b, type: 'rel' });

    set.addNode(a);
    set.addNode(b);
    set.addRelationship(rel);
  });

  it('should know which nodes it contains', () => {
    assert(set.contains(a.uuid()), 'Contains A');
    assert(set.contains(b.uuid()), 'Contains B');
    assert(set.contains(rel.uuid()), 'Contains Rel');

    assert.equal(set.contains('nonexistant in this set'), false);
  });

  describe('Cypher', () => {
    it('should generate CREATE cypher', () => {
      const cypher = set.cypher('create');

      /*
      CREATE (e0:`A` { })
      CREATE (e1:`B` { })
      CREATE (e0)-[e2:`rel`]->(e1);
      */

      console.log(cypher);
      assert.match(cypher, /CREATE\s*\([a-z0-9]*:\`A\`/, 'Created A');
      assert.match(cypher, /CREATE\s*\([a-z0-9]*:\`B\`/, 'Created B');
      assert.match(cypher, /-\[[a-z0-9]*:\`rel\`\]/, 'Created rel');
    });
  });
});
