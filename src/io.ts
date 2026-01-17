import type {
  BaseObjectNumberType,
  NumberType,
  ObjectNumberType,
  ParseNumberParamsType,
  SignType,
} from './types';

/**
 * Removes trailing zeros from a decimal string (e.g., '1.500' -> '1.5').
 */
export const clearTrailingZero = (value: string): string => value.replace(/0+$/, '');

/**
 * Removes leading zeros from a string (e.g., '005' -> '5').
 */
export const clearLeadingZero = (value: string): string => value.replace(/^0+(?!$)/, '');

/**
 * Removes redundant leading and trailing zeros from a number string.
 */
export function clearUnnecessaryZero(value: string) {
  return value
    .replace(/^(-?)0+(?=\d)/, '$1')
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '');
}

/**
 * Parses various input formats into a standard decimal string.
 */
export function parseNum(value: NumberType, options: ParseNumberParamsType = {}): string {
  const { fallback = '--' } = options;
  if (typeof value === 'number' || typeof value === 'bigint') return value.toString();

  const input = String(value ?? '').trim();
  if (!input) return '0';

  // Extract effective sign
  const signMatch = input.match(/^[\s+-]*/);
  const negative = ((signMatch && signMatch[0].match(/-/g)) || []).length % 2 === 1;

  // Remove currency, commas, underscores, spaces
  const cleaned = input.replace(/[$€£¥,_\s]/g, '');

  // 1. Small decimal format (e.g., "5.0₄6")
  const smallMatch = cleaned.match(/^([+-]?\d+)\.0([\u2080-\u2089]+)([0-9]*)$/i);
  if (smallMatch) {
    const [, intPart, sub, tail] = smallMatch;
    // ₀ = 0x2080.
    const zeros = sub.split('').reduce((acc, c) => acc + (c.charCodeAt(0) - 0x2080), 0);
    const res = clearUnnecessaryZero(intPart.replace(/^[+-]/, '') + '.' + '0'.repeat(zeros) + tail);
    return (negative ? '-' : '') + (res || '0');
  }

  // 2. Standard parsing (suffixes, scientific)
  const numMatch = cleaned.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[KMBTQ]*/i);
  if (!numMatch) return fallback;

  let str = numMatch[0].toUpperCase();
  let power = 0;

  // Suffix (K=3, M=6, ...)
  const suffix = str.slice(-1);
  const sIdx = 'KMBTQ'.indexOf(suffix);
  if (sIdx !== -1) {
    power = (sIdx + 1) * 3;
    str = str.slice(0, -1);
  }

  // Scientific notation
  const sciMatch = str.match(/[E]([+-]?\d+)$/);
  if (sciMatch) {
    power += parseInt(sciMatch[1], 10);
    str = str.slice(0, sciMatch.index);
  }

  str = str.replace(/^[+-]/, ''); // remove sign
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(str)) return '0';

  const [intP = '0', fracP = ''] = str.split('.');
  const totalDigits = (intP.replace(/^0+/, '') || '0') + fracP;
  const decimalPos = fracP.length - power;

  let result: string;
  if (decimalPos <= 0) {
    result = (totalDigits + '0'.repeat(-decimalPos)).replace(/^0+(?=\d)/, '') || '0';
  } else {
    const idx = totalDigits.length - decimalPos;
    result =
      idx <= 0
        ? '0.' + '0'.repeat(-idx) + totalDigits
        : totalDigits.slice(0, idx) + '.' + totalDigits.slice(idx);
    result = clearUnnecessaryZero(result);
  }

  return (negative ? '-' : '') + (result || '0');
}

export function getBaseNumberNumber(value: NumberType): BaseObjectNumberType {
  let str = String(value).trim();
  const sign = str.startsWith('-') ? '-' : '';
  if (sign) str = str.slice(1);
  const [intPart, fracPart = ''] = clearUnnecessaryZero(str).split('.');
  return { sign: sign as SignType, intPart, fracPart };
}

export const getStandardOutput = (value: BaseObjectNumberType): string =>
  value.fracPart
    ? `${value.sign}${value.intPart}.${value.fracPart}`
    : `${value.sign}${value.intPart}`;

export function convertToObjectNumber(value: NumberType | ObjectNumberType): ObjectNumberType {
  return typeof value === 'object' && value !== null && 'intPart' in value
    ? (value as ObjectNumberType)
    : getBaseNumberNumber(value as NumberType);
}
