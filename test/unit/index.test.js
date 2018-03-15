import assert from 'assert';
import json2neo from '../../src/index';

describe('root', () => {
  it('it should add 2 + 2', () => {
    assert.equal(2 + 2, 4);
  });

  it('should create regular primitive properties', () => {
    const input = { a: 1, b: "foo" };

    const cache = json2neo(input);
    const nodes = cache.getNodes();

    assert.equal(nodes.length, 1);
    const n1 = nodes[0];
    const props = n1.getProperties();
    assert.equal(props.a, 1);
    assert.equal(props.b, 'foo');
  });

  it('does not run on arrays', () => {
    assert.throws(() => json2neo(['foo']), Error);
  });

  it('does not run on non-objects', () => {
    assert.throws(() => json2neo(), Error);
    assert.throws(() => json2neo(null), Error);
  });

  it('should create array properties', () => {
    const arr = [1,2,3,"foo"];
    const input = { myArray: arr };
    const cache = json2neo(input);
    const props = cache.getNodes()[0].getProperties();
    assert.deepEqual(props.myArray, arr);
  });

  it('should create nested sub-objects and assign proper labels', () => {
    const input = {
      l1: {
        l2: {
          foo: 'bar'
        }
      }
    };

    const cache = json2neo(input, 'Base');
    const nodes = cache.getNodes();
    const rels = cache.getRelationships();

    const l1 = nodes.filter(n => n.label === 'l1')[0];
    const l2 = nodes.filter(n => n.label === 'l2')[0];
    const b = nodes.filter(n => n.label === 'Base')[0];

    assert(l1, 'Contains l1');
    assert(l2, 'Contains l2');
    assert(b, 'Contains base');

    const base2l1 = rels.filter(r => r.getFrom() === b && r.getTo() === l1)[0];
    const l12l2 = rels.filter(r => r.getFrom() === l1 && r.getTo() === l2)[0];

    assert(base2l1, 'Relationship from base -> l1');
    assert(l12l2, 'Relationship l1 -> l2');
  });

  it('should loop through nested objects in arrays', () => {
    const input = {
      arr: [
        { x: 1 },
        { x: 2 }
      ],
    };

    const cache = json2neo(input, 'Base');
    const nodes = cache.getNodes();
    const rels = cache.getRelationships();

    const first = nodes.filter(n => n.label === 'arr' && n.getProperties().x == 1)[0];
    const second = nodes.filter(n => n.label === 'arr' && n.getProperties().x == 2)[0];
    const base = nodes.filter(n => n.label === 'Base')[0];

    assert(first, 'Contains first');
    assert(second, 'Contains second');
    assert(base, 'Contains base');

    const base2First = rels.filter(r => r.getFrom() === base && r.getTo() === first)[0];
    const base2Second = rels.filter(r => r.getFrom() === base && r.getTo() === second)[0];

    assert(base2First, 'Relationship from base -> first ');
    assert(base2Second, 'Relationship base -> second');
    assert.equal(base2First.getType(), 'arr');
    assert.equal(base2Second.getType(), 'arr');
  });
});
