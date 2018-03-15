import uuid from 'uuid';
import _ from 'lodash';

export default class GraphEntity {
  constructor({ properties }) {
    this._uuid = uuid.v4();
    this.props = _.merge(
      { _uuid: this._uuid }, properties || {},
    );
  }

  getProperties() { return this.props; }

  setProperties(properties) {
    this.props = _.merge({ _uuid: this._uuid }, properties);
  }

  setProperty(key, value) {
    if(_.isObject(value) && !_.isArray(value)) {
      throw new Error('Neo4j properties cannot be objects/maps');
    }

    this.props[key] = value;
  }

  cypherIdentifier(str) {
    return '`' + str.replace(/`/g, '\\`') + '`';
  }

  escapeIdentifier(str) {
    return str.replace(/\`/g, '\\`');
  }

  cypherProperty(key, assigner=':') {
    return `\`${key}\`${assigner} ${this.cypherPrimitive(this.props[key])}`;
  }

  cypherProperties() {
    return `{${Object.keys(this.props).map(key => this.cypherProperty(key)).join(',\n')} }`;
  }

  cypherPrimitive(primitive) {
    if (_.isNil(primitive) || _.isNaN(primitive)) {
      return "null";
    }

    if (_.isNumber(primitive) || _.isBoolean(primitive)) {
      return primitive;
    } else if (_.isString(primitive)) {
      return `"${primitive.replace(/"/g, '\\"')}"`;
    } else if (_.isArray(primitive)) {
      return `[${primitive.map(i => this.cypherPrimitive(i)).join(',')}]`;
    } else {
      throw new Error(`Cannot cypherPrimitive value ${primitive}: not primitive`);
    }
  }

  uuid() {
    return this._uuid;
  }
};
