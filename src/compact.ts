import { clearLeadingZero, clearTrailingZero, getBaseNumberNumber, getStandardOutput } from './io';
import { _round } from './round';
import type { BaseObjectNumberType, NumberType, RoundingConfigType } from './types';

const configs = ['K', 'M', 'B', 'T', 'Q'];

export function _compact(
  value: BaseObjectNumberType,
  options: RoundingConfigType = {},
): BaseObjectNumberType & { symbol: string } {
  // eslint-disable-next-line prefer-const
  let { sign, intPart, fracPart } = value;
  let len = intPart.length;
  let counter = -1;
  while (len > 3 && counter < 4) {
    const _intPart = intPart.slice(0, len - 3);
    fracPart = intPart.slice(len - 3) + fracPart;
    intPart = _intPart;
    len -= 3;
    counter++;
  }
  const _result =
    options.precision != undefined
      ? _round({ sign, intPart, fracPart }, options)
      : { sign, intPart, fracPart };
  return {
    sign,
    intPart: clearLeadingZero(_result.intPart),
    fracPart: clearTrailingZero(_result.fracPart),
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
  const { sign, intPart, fracPart, symbol } = _compact(getBaseNumberNumber(value), options);
  return getStandardOutput({ sign, intPart, fracPart }) + symbol;
}
