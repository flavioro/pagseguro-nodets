export type currency = Currency | string;

export class Currency {
  valueFormatted: string;
  value: number;

  constructor(value: number) {
    try {
      this.value = value;
      this.valueFormatted = value.toFixed(2);
    } catch (e) {
      throw new TypeError('Invalid currency');
    }
  }
}
