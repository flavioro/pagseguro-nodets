// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleFunction = (fn: any, ...args: any[]): void => {
  if (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Invalid argument');
    }
    fn(...args);
  }
};
export default handleFunction;
