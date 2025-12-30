import { round } from './round';
import type { NumberType, RoundingConfigType } from './types';

export function FN(value: NumberType) {
  return {
    round(options: RoundingConfigType = {}) {
      return FN(round(value, options));
    },
    toString() {
      return String(value);
    },
    toNumber() {
      return Number(value);
    },
  };
}
