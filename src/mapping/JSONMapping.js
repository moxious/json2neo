import fs from 'fs';
import _ from 'lodash';

export default class JSONMapping {
  constructor(mapping) {
    this.mapping = mapping || {};
  }

  getNodeLabel(jsonPropertyName) {
    const entry = _.get(this.mapping, jsonPropertyName);
    return _.get(entry, 'label') || jsonPropertyName;
  }

  getRelationshipType(jsonPropertyName) {
    const entry = _.get(this.mapping, jsonPropertyName);
    return _.get(entry, 'relationshipType') || jsonPropertyName;
  }
}
