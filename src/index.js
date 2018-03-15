/**
 * @module src/index
 */

import util from 'util';
import _ from 'lodash';
import Node from './neo4j/Node';
import Relationship from './neo4j/Relationship';
import GraphEntitySet from './neo4j/GraphEntitySet';
import JSONMapping from './mapping/JSONMapping';

const debug = process.env.DEBUG;

const walkArray = (parent, arr, label, cache, mapping) => {
  if (debug) { console.log('walkArray', arr); }
  const primitives = arr.filter(i => !_.isObject(i) && !_.isArray(i));
  const subArrays = arr.filter(i => _.isArray(i));
  const subObjects = arr.filter(i => _.isObject(i) && !_.isArray(i));

  if (subArrays.length > 0) {
    throw new Error('Nested arrays not yet supported');
  }

  if (primitives.length > 0) {
    parent.setProperty(label, primitives);
  }

  if (subObjects.length > 0) {
    subObjects.forEach((obj, idx) => {
      const connectedNode = recursiveWalkObject(obj, mapping.getNodeLabel(label), cache, mapping);
      const rel = new Relationship({
        from: parent, to: connectedNode, type: mapping.getRelationshipType(label),
      });
      rel.setProperty('index', idx);
      cache.addRelationship(rel);
    });
  }

  return null;
};

const recursiveWalkObject = (obj, label, cache, mapping) => {
  if (debug) { console.log('Walking ', label); }

  const here = new Node({ label });
  const propertiesHere = {};

  _.forOwn(obj, (value, key) => {
    if (_.isArray(value)) {
      walkArray(here, value, key, cache, mapping);
    } else if (_.isObject(value)) {
      const connectedNode = recursiveWalkObject(
        value, mapping.getNodeLabel(key), cache, mapping);
      const rel = new Relationship({
        from: here,
        to: connectedNode,
        type: mapping.getRelationshipType(key),
      });

      cache.addRelationship(rel);
    } else {
      // Primitive.
      here.setProperty(key, value);
    }

    // It's a primitive value.
    propertiesHere[key] = value;
  });

  cache.addNode(here);
  return here;
};

/**
 *
 * @param {Object}
 *
 * @return {GraphEntitySet} a set of Graph Entities that result
 *
 * @example
 *
 *  import json2neo from 'src/index';
 *
 *  json2neo({ x: 1 })
 */
const json2neo = (object, impliedLabel='Node', mapping=new JSONMapping()) => {
  if (!_.isObject(object) || _.isArray(object)) {
    throw new Error('Must provide an object');
  } else if (!impliedLabel) {
    throw new Error('Must provide implied label');
  }

  // Create a cache to hold results, walk the object transforming it,
  // populate the cache.
  const cache = new GraphEntitySet();
  recursiveWalkObject(object, impliedLabel, cache, mapping);

  return cache;
};

export default json2neo;
