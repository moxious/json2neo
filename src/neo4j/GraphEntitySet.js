import _ from 'lodash';

/**
 * A simple cache by UUID of nodes and relationships.
 */
export default class GraphEntitySet {
  constructor(mapping) {
    this.nodes = {};
    this.relationships = {};
    this.entities = {};
    this.tags = {};
    this.counter = 0;
    this.mapping = mapping;
  }

  _assignTag(e) {
    if (!e) { throw new Error('argument missing'); }
    this.tags[e.uuid()] = `e${this.counter++}`;
  }

  getNodes() {
    return _.values(this.nodes);
  }

  getRelationships() {
    return _.values(this.relationships);
  }

  addNode(n) {
    if (!n) { throw new Error('argument missing'); }
    this.nodes[n.uuid()] = n;
    this.entities[n.uuid()] = n;
    this._assignTag(n);
  }

  addRelationship(r) {
    if (!r) { throw new Error('argument missing'); }
    this.relationships[r.uuid()] = r;
    this.entities[r.uuid()] = r;
    this._assignTag(r);
  }

  getTag(uuid) {
    return this.tags[uuid];
  }

  contains(uuid) {
    return !_.isNil(this.entities[uuid]);
  }

  cypher(operation='create') {
    const nodeStmts = [];
    const relStmts = [];

    _.values(this.nodes).forEach(node => {
      const tag = this.tags[node.uuid()];
      const stmt = operation === 'create' ? node.createCypher(tag, this) : node.mergeCypher(tag, this);
      nodeStmts.push(stmt);
    });

    _.values(this.relationships).forEach(rel => {
      const stmt = operation === 'create' ? rel.createCypher(this) : rel.mergeCypher(this);
      relStmts.push(stmt);
    });

    return nodeStmts.join('\n') + '\n' + relStmts.join('\n') + ';';
  }
};
