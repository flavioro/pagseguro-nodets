/**
 * isArray
 */
function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * isFunction
 */
function isFunction(value: any): boolean {
  return typeof value === 'function';
}

/**
 * isObject
 */
function isObject(value: any): boolean {
  const type = typeof value;
  return type === 'function' || (type === 'object' && !!value);
}

/**
 * exports
 */
export default {
  isArray,
  isFunction,
  isObject,
};
