import GraphEntity from './GraphEntity';

export default class Relationship extends GraphEntity {
  constructor(args) {
    super(args);

    if (!args.type) {
      throw new Error('Relationships may not be untyped');
    }

    if (!args.from || !args.to) {
      throw new Error('Relationships must specify from and to');
    }

    this.type = args.type;
    this.from = args.from;
    this.to = args.to;
  }

  getFrom() { return this.from; }
  getTo() { return this.to; }
  getType() { return this.type; }

  mergeCypher(cache) {
    return this.cypher(cache, 'MERGE');
  }

  createCypher(cache) {
    return this.cypher(cache, 'CREATE');
  }

  cypher(cache, operation='CREATE') {
    if (!cache) {
      throw new Error('Must pass graphcache');
    }

    const fromTag = cache.getTag(this.from.uuid());
    const toTag = cache.getTag(this.to.uuid());
    const relTag = cache.getTag(this.uuid());

    if (!fromTag || !toTag) {
      throw new Error('From tag or to tag missing from graph cache');
    }

    // ${this.cypherProperties()} removed to prevent merge from failing every time.
    return `${operation} (${fromTag})-[${relTag}:\`${this.type}\`]->(${toTag})`;
  }
};
