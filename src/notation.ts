import { getInput } from './io';

/**
 * Formats the decimal part of small numbers using subscript characters
 * to represent the number of consecutive leading zeros.
 *
 * @param value - The number string to format.
 * @returns A string with subscript notation (e.g., '0.0₃5').
 */
export function subscript(value: string) {
  const { sign, value: str } = getInput(value);
  const [intPart, fracPart = ''] = str.split('.');
  const leadingZeros = fracPart.match(/^0+/)?.[0]?.length || 0;
  const subscript = leadingZeros
    .toString()
    .split('')
    .map((digit) => String.fromCharCode(0x2080 + parseInt(digit)))
    .join('');
  const trimmedDecimal = fracPart.slice(leadingZeros);
  return `${sign}${intPart}.0${subscript}${trimmedDecimal}`;
}

export function _scientific(value: string) {
  const { sign, value: str } = getInput(value);
  if (str == '0') return { value: '0', exponent: 0 };
  const [intPart, fracPart = ''] = str.split('.');

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
 *
 * @param value - The number string to format.
 * @returns A string in scientific notation (e.g., '1.23e+5').
 */
export function scientific(value: string) {
  const { value: str, exponent, sign } = _scientific(value);
  const finalStr = str.replace(/\.$/, '');
  return exponent != 0 ? `${finalStr}e${sign}${exponent}` : finalStr;
}
