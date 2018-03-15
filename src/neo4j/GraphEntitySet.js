import _ from 'lodash';

/**
 * A simple cache by UUID of nodes and relationships.
 */
export default class GraphEntitySet {
  constructor() {
    this.nodes = {};
    this.relationships = {};
    this.entities = {};
    this.tags = {};
    this.counter = 0;
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

  cypher() {
    const createNodeStmts = [];
    const createRelStmts = [];

    _.values(this.nodes).forEach(node => {
      createNodeStmts.push(node.createCypher(this.tags[node.uuid()]));
    });

    _.values(this.relationships).forEach(rel => {
      createRelStmts.push(rel.createCypher(this));
    });

    return createNodeStmts.join('\n') + '\n' + createRelStmts.join('\n') + ';';
  }
};
