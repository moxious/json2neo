import GraphEntity from './GraphEntity';

export default class Node extends GraphEntity {
  constructor(args) {
    super(args);

    this.label = args.label || 'Node';
  }

  mergeCypher(boundTo, cache) {
    const keyProp = cache.mapping.getKey(this.label);

    if (!keyProp) {
      // can't merge w/o a key.
      return this.createCypher(boundTo, cache);
    }

    const nonKeyProps = Object.keys(this.getProperties()).filter(i => i !== keyProp);

    return `MERGE (${boundTo}:\`${this.label}\` { ${this.cypherProperty(keyProp)} })
      ON CREATE SET ${nonKeyProps.map(p => boundTo + '.' + this.cypherProperty(p, '=')).join(', ')}
    `;
  }

  createCypher(boundTo, cache) {
    return `CREATE (${boundTo}:\`${this.label}\` ${this.cypherProperties()})`;
  }
};
