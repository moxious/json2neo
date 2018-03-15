import assert from 'assert';
import JSONMapping from '../../../src/mapping/JSONMapping';

describe('JSONMapping', () => {
  const mappingData = {
    a: {
      label: 'foo',
      relationshipType: 'bar'
    }
  };

  let m;

  beforeEach(() => {
    m = new JSONMapping(mappingData);
  });

  it('should construct empty mappings', () => {
    assert(new JSONMapping());
  });

  it('should construct mappings with an object', () => {
    assert(m);
  });

  it('should lookup labels by property type', () => {
    assert.equal(m.getNodeLabel('a'), 'foo');
  });

  it('should lookup relationship types by property name', () => {
    assert.equal(m.getRelationshipType('a'), 'bar');
  });
});
