import { getInput } from './io';
import type { NumberType, RoundingConfigType } from './types';

function plusOne(value: string) {
  let result = '';
  let counter = value.length - 1;
  let remaining = '1';
  while (counter >= 0) {
    const digit = value[counter];
    let total = Number(digit) + (remaining ? 1 : 0);
    if (total >= 10) {
      remaining = '1';
      total -= 10;
    } else remaining = '';
    result = total.toString() + result;
    counter--;
  }
  return { result: remaining + result, remaining };
}

export function roundPositiveHalf(value: string, precision = 0): string {
  const [intPart, fracPart = ''] = value.split('.');
  if (precision === 0) {
    if (fracPart) {
      if (Number(fracPart[0]) >= 5) return plusOne(intPart).result;
      else return intPart;
    }
    return intPart;
  }
  if (precision >= fracPart.length) return intPart + (fracPart ? `.${fracPart}` : '');
  const fracPartRound = fracPart.slice(0, precision);
  const fracPartRest = fracPart.slice(precision);
  if (Number(fracPartRest[0]) >= 5) {
    const _fracPartRound = plusOne(fracPartRound);
    if (!_fracPartRound.remaining) return intPart + '.' + _fracPartRound.result;
    return plusOne(intPart).result;
  } else return intPart + '.' + fracPartRound;
}

function roundPositiveUp(value: string, precision = 0): string {
  const [intPart, fracPart = ''] = value.split('.');
  if (precision === 0) {
    if (!fracPart) return intPart;
    else return plusOne(intPart).result;
  }
  if (precision >= fracPart.length) return intPart + '.' + fracPart;
  const fracPartRound = plusOne(fracPart.slice(0, precision));
  if (!fracPartRound.remaining) return intPart + '.' + fracPartRound.result;
  return plusOne(intPart).result;
}

function roundPositiveDown(value: string, precision = 0): string {
  const [intPart, fracPart = ''] = value.split('.');
  if (precision === 0) return intPart;
  let fracPartRound = fracPart.slice(0, precision);
  let counter = fracPartRound.length - 1;
  while (counter >= 0 && fracPartRound[counter] == '0') counter--;
  fracPartRound = fracPartRound.slice(0, counter + 1);
  return intPart + (fracPartRound ? `.${fracPartRound}` : '');
}

function roundPositiveBanker(value: string, precision = 0): string {
  const [intPart, fracPart = ''] = value.split('.');
  if (precision === 0) {
    if (fracPart) {
      if (Number(fracPart[0]) >= 5) {
        if (Number(intPart[0]) / 2 == 0) return intPart;
        return plusOne(intPart).result;
      } else return intPart;
    }
    return intPart;
  }
  if (precision >= fracPart.length) return intPart + (fracPart ? `.${fracPart}` : '');
  const fracPartRound = fracPart.slice(0, precision);
  const fracPartRest = fracPart.slice(precision);
  if (fracPartRest[0] == '5') {
    if (Number(fracPartRound[fracPartRound.length - 1]) % 2 == 0)
      return intPart + '.' + fracPartRound;
    else {
      const _fracPartRound = plusOne(fracPartRound);
      if (!_fracPartRound.remaining) return intPart + '.' + _fracPartRound.result;
      return plusOne(intPart).result;
    }
  } else if (Number(fracPartRest[0]) > 5) {
    const _fracPartRound = plusOne(fracPartRound);
    if (!_fracPartRound.remaining) return intPart + '.' + _fracPartRound.result;
    return plusOne(intPart).result;
  } else return intPart + '.' + fracPartRound;
}

/**
 * Rounds a number based on the specified precision and rounding mode.
 *
 * @param value - The value to be rounded. Can be a number, string, or bigint.
 * @param options - Configuration for rounding.
 * @param options.rounding - The rounding strategy to use ('half', 'up', 'down', 'banker', 'truncate'). Default is 'half'.
 * @param options.precision - The number of decimal places to round to. Default is 0.
 * @returns The rounded number as a string.
 *
 * @example
 * round(123.456, { precision: 2 }); // '123.46'
 * round(123.45, { rounding: 'down', precision: 1 }); // '123.4'
 */
export function round(value: NumberType, options: RoundingConfigType = {}) {
  const mode = options.rounding || 'half';
  const precision = options.precision || 0;
  const { sign, value: str } = getInput(value);

  switch (mode) {
    case 'half':
      return sign + roundPositiveHalf(str, precision);

    case 'up':
      return sign == '' ? roundPositiveUp(str, precision) : '-' + roundPositiveDown(str, precision);

    case 'down':
      return sign == '' ? roundPositiveDown(str, precision) : '-' + roundPositiveUp(str, precision);

    case 'truncate':
      return sign + roundPositiveDown(str, precision);

    case 'banker': {
      return sign + roundPositiveBanker(str, precision);
    }
  }
}
