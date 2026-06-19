import { convertToObjectNumber } from './io';
import type { BaseObjectNumberType, NumberType, ScientificReturnType } from './types';

/**
 * Formats the decimal part of small numbers using subscript characters.
 */
export function subscript(value: NumberType | BaseObjectNumberType) {
  const { sign, intPart, fracPart } = convertToObjectNumber(value);
  const leadingZeros = fracPart.match(/^0+/)?.[0]?.length || 0;

  const sub = leadingZeros
    .toString()
    .split('')
    .reduce((acc, d) => acc + String.fromCharCode(0x2080 + Number(d)), '');
  return `${sign}${intPart}.0${sub}${fracPart.slice(leadingZeros)}`;
}

export function _scientific(value: BaseObjectNumberType): ScientificReturnType {
  const { sign, intPart, fracPart } = value;

  if (intPart !== '0') {
    const exponent = intPart.length - 1;
    const mantissa = (intPart[0] + '.' + (intPart.slice(1) + fracPart).replace(/0+$/, '')).replace(
      /\.$/,
      '',
    );
    return { value: `${sign}${mantissa}`, exponent, sign: '+' };
  }

  const firstNonZero = fracPart.search(/[1-9]/);
  if (firstNonZero === -1) return { value: '0', exponent: 0 };

  const exponent = -(firstNonZero + 1);
  const mantissa = (
    fracPart[firstNonZero] +
    '.' +
    fracPart.slice(firstNonZero + 1).replace(/0+$/, '')
  ).replace(/\.$/, '');

  return { value: `${sign}${mantissa}`, exponent, sign: '' };
}

/**
 * Formats a number string using standard scientific notation.
 */
export function scientific(value: NumberType | BaseObjectNumberType) {
  const { value: str, exponent, sign } = _scientific(convertToObjectNumber(value));
  return exponent !== 0 ? `${str}e${sign}${exponent}` : str;
}
