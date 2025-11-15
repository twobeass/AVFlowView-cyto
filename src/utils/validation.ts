import Ajv, { ValidateFunction } from 'ajv';
import { AVWiringGraph } from '../types/graph.types';
import schema from '../schemas/av-wiring-graph.schema.json';

const ajv = new Ajv({ strict: false });
const validateGraph: ValidateFunction = ajv.compile(schema);

/**
 * Validates data against the AVWiringGraph JSON schema
 * @param data - Data to validate
 * @returns True if data is valid AVWiringGraph
 */
export function validateAVWiringGraph(data: unknown): data is AVWiringGraph {
  const valid = validateGraph(data);
  if (!valid) {
    console.error('Validation errors:', validateGraph.errors);
    return false;
  }
  return true;
}

/**
 * Returns human-readable validation error messages
 * @returns Array of error messages
 */
export function getValidationErrors(): string[] {
  if (!validateGraph.errors) return [];
  return validateGraph.errors.map(
    (err) => `${err.instancePath} ${err.message}`
  );
}
