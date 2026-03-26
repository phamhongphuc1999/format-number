import { clearLeadingZero, clearTrailingZero, getBaseNumberNumber, getStandardOutput } from './io';
import { _round } from './round';
import type { BaseObjectNumberType, NumberType, RoundingConfigType } from './types';

const configs = ['K', 'M', 'B', 'T', 'Q'];

export function _compact(
  value: BaseObjectNumberType,
  options: RoundingConfigType = {},
): BaseObjectNumberType & { symbol: string } {
  const sign = value.sign;
  let { intPart, fracPart } = value;
  const symbols =
    options.compactSymbols && options.compactSymbols.length > 0 ? options.compactSymbols : configs;
  const maxCounter = symbols.length - 1;
  let counter = -1;

  if (intPart.length > 3 && maxCounter >= 0) {
    const groupsMoved = Math.min(Math.floor((intPart.length - 1) / 3), maxCounter + 1);
    const shift = groupsMoved * 3;
    const cut = intPart.length - shift;
    fracPart = intPart.slice(cut) + fracPart;
    intPart = intPart.slice(0, cut);
    counter = groupsMoved - 1;
  }

  const _result =
    options.precision != undefined
      ? _round({ sign, intPart, fracPart }, options)
      : { sign, intPart, fracPart };

  let nextInt = _result.intPart;
  let nextFrac = _result.fracPart;
  let nextCounter = counter;

  while (nextInt.length > 3 && nextCounter < maxCounter) {
    const cut = nextInt.length - 3;
    nextFrac = nextInt.slice(cut) + nextFrac;
    nextInt = nextInt.slice(0, cut);
    nextCounter++;
  }

  return {
    sign,
    intPart: clearLeadingZero(nextInt),
    fracPart: options.fixed ? nextFrac : clearTrailingZero(nextFrac),
    symbol: nextCounter >= 0 ? symbols[nextCounter] : '',
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
