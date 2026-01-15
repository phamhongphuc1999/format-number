import { clearTrailingZero, getInput } from './io';
import { round } from './round';
import type { NumberType, RoundingConfigType } from './types';

const configs = ['K', 'M', 'B', 'T', 'Q'];

export function _compact(value: NumberType, options: RoundingConfigType = {}) {
  const { sign, value: str } = getInput(value);
  let [intPart, fracPart = ''] = str.split('.');
  let len = intPart.length;
  let counter = -1;
  while (len > 3 && counter < 4) {
    const _intPart = intPart.slice(0, len - 3);
    fracPart = intPart.slice(len - 3) + fracPart;
    intPart = _intPart;
    len -= 3;
    counter++;
  }
  const rawResult = `${sign}${intPart}${fracPart.length > 0 ? '.' + fracPart : ''}`;
  const cleanedResult = clearTrailingZero(rawResult);

  return {
    value: options.precision !== undefined ? round(cleanedResult, options) : cleanedResult,
    symbol: counter >= 0 ? configs[counter] : '',
  };
}

/**
 * Formats a number into a short, human-readable string with a suffix (e.g., K, M, B).
 *
 * @param value - The value to be compacted. Can be a number, string, or bigint.
 * @param options - Configuration for rounding the compacted value.
 * @param options.rounding - The rounding strategy to use. Default is 'half'.
 * @param options.precision - The number of decimal places to include after compacting. Default is 0.
 * @returns The compacted number with a suffix as a string.
 *
 * @example
 * compact(1500); // '1.5K'
 * compact(1200000, { precision: 1 }); // '1.2M'
 * compact('1000000000000'); // '1T'
 */
export function compact(value: NumberType, options: RoundingConfigType = {}) {
  const { value: str, symbol } = _compact(value, options);
  return str + symbol;
}
