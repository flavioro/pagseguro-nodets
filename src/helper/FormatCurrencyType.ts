import { Currency } from '../interfaces/CurrencyType';

const formatCurrencyType = <T extends object>(obj: T): T => {
  const object = obj as any;

  Object.keys(obj).forEach(key => {
    const value = object[key];
    if (value instanceof Currency) {
      object[key] = value.valueFormatted;
    } else if (typeof value === 'object') {
      object[key] = formatCurrencyType(value);
    }
  });

  return object;
};

export default formatCurrencyType;
