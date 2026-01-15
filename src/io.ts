import type { NumberType, ObjectNumberType, ParseNumberParamsType, SignType } from './types';

/**
 * Removes redundant leading and trailing zeros from a number string.
 *
 * @param value - The number string to clean.
 * @returns The cleaned number string.
 */
export function clearTrailingZero(value: string) {
  const str = value.replace(/^(-?)0+(?=\d)/, '$1');
  return str.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

const suffixMap: Record<string, number> = { K: 3, M: 6, B: 9, T: 12, Q: 15 };

/**
 * Parses various input formats into a standard decimal string.
 * Supports numbers, bigints, currencies ($€£¥), commas, underscores,
 * scientific notation (e+), and custom subscript notation (e.g., "5.0₄6").
 *
 * @param value - The input value to parse.
 * @param options - Optional configuration for parsing (e.g., fallback value).
 * @returns A standardized decimal string.
 *
 * @example
 * parseNum('$1,234.56'); // '1234.56'
 * parseNum('invalid', { fallback: '0' }); // '0'
 * parseNum('5.0₄6'); // '5.00006'
 */
export function parseNum(value: NumberType, options: ParseNumberParamsType = {}): string {
  const { fallback = '--' } = options;
  // Direct number / bigint
  if (typeof value === 'number' || typeof value === 'bigint') {
    return value.toString();
  }

  const input = String(value ?? '').trim();
  if (input === '') return '0';

  // Extract effective sign (odd number of '-' → negative)
  const signMatch = input.match(/^[\s+-]*/);
  const rawSign = signMatch ? signMatch[0] : '';
  const negative = (rawSign.match(/-/g) || []).length % 2 === 1;

  // Remove currency symbols, commas, underscores, spaces
  const cleaned = input.replace(/[$€£¥,_\s]/g, '');

  // ──────────────────────────────────────────────────────────────
  // 1. Special handling for your custom small decimal format:
  //    e.g. "5.0₄6"  → 5.00006
  //    Pattern: integer . 0 one-or-more subscript digits optional remaining digits
  // ──────────────────────────────────────────────────────────────
  const smallDecimalRegex = /^([+-]?\d+)\.0([\u2080-\u2089]+)([0-9]*)$/i;
  const smallMatch = cleaned.match(smallDecimalRegex);

  if (smallMatch) {
    const intPart = smallMatch[1].replace(/^[+-]/, ''); // remove possible sign here
    const subscriptStr = smallMatch[2];
    const trailingDigits = smallMatch[3];

    // Convert each subscript character to its normal digit value
    const zeroCount = subscriptStr.split('').reduce((count, char) => {
      const code = char.charCodeAt(0);
      const digit = code - 0x2080; // ₀ = U+2080 → 0, ₁ → 1, etc.
      return count + digit;
    }, 0);

    // Build the full number
    const decimalPart = '0'.repeat(zeroCount) + trailingDigits;

    let result = intPart;
    if (decimalPart !== '' || zeroCount > 0) {
      result += '.' + decimalPart;
    }

    // Clean trailing zeros and possible trailing dot
    result = clearTrailingZero(result);

    return (negative ? '-' : '') + (result || '0');
  }

  // ──────────────────────────────────────────────────────────────
  // 2. Fallback: standard parsing (suffixes K/M/B, scientific e, etc.)
  // ──────────────────────────────────────────────────────────────
  const numMatch = cleaned.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[KMBTQ]*/i);
  if (!numMatch) return fallback;

  let str = numMatch[0].toUpperCase();
  let power = 0;

  // Suffix (K, M, B, T, Q)
  const suffixMatch = str.match(/[KMBTQ]$/);
  if (suffixMatch) {
    power += suffixMap[suffixMatch[0]] ?? 0;
    str = str.slice(0, -1);
  }

  // Scientific notation
  const sciMatch = str.match(/[eE][+-]?\d+$/);
  if (sciMatch) {
    power += parseInt(sciMatch[0].slice(1), 10);
    str = str.replace(/[eE][+-]?\d+$/i, '');
  }

  // Remove any remaining sign from the number string
  str = str.replace(/^[+-]/, '');

  // Validate it's a proper decimal
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(str)) return '0';

  const [intPart = '0', fracPart = ''] = str.split('.');
  let digits = (intPart.replace(/^0+/, '') || '0') + fracPart;
  const decimalPos = fracPart.length - power;

  let result: string;
  if (decimalPos <= 0) {
    digits += '0'.repeat(-decimalPos);
    result = digits.replace(/^0+(?=\d)/, '') || '0';
  } else {
    const idx = digits.length - decimalPos;
    if (idx <= 0) {
      result = '0.' + '0'.repeat(-idx) + digits;
    } else {
      result = digits.slice(0, idx) + '.' + digits.slice(idx);
    }
    result = clearTrailingZero(result);
  }

  return (negative ? '-' : '') + (result || '0');
}

export function getInput(value: NumberType): { sign: SignType; value: string } {
  let str = String(value);
  str = str.trim();
  let sign: SignType = '';
  if (str.startsWith('-')) {
    str = str.slice(1);
    sign = '-';
  }
  return { sign, value: clearTrailingZero(str) };
}

export function convertToObjectNumber(value: NumberType | ObjectNumberType): ObjectNumberType {
  const _type = typeof value;
  if (_type == 'string' || _type == 'bigint' || _type == 'number') {
    const { sign, value: str } = getInput(value as NumberType);
    return { sign, value: str };
  }
  return value as ObjectNumberType;
}
