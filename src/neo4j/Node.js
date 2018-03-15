import GraphEntity from './GraphEntity';

export default class Node extends GraphEntity {
  constructor(args) {
    super(args);

    this.label = args.label || 'Node';
  }

  createCypher(boundTo) {
    return `CREATE (${boundTo}:\`${this.label}\` ${this.cypherProperties()})`;
  }
};
