import type { NumberType, RoundingConfigType } from './types';

export function roundHalf(value: NumberType, precision = 0): string {
  const str = String(value);

  const sign = str.startsWith('-') ? '-' : '';
  const abs = sign ? str.slice(1) : str;

  const [intPart, frac = ''] = abs.split('.');

  const digitToRound = Number(frac[precision] ?? '0');

  const beforeRound = frac
    .slice(0, precision)
    .split('')
    .reduce((acc, d) => acc * 10 + Number(d), 0);

  let rounded = beforeRound;
  if (digitToRound >= 5) rounded += 1;

  let newFrac = rounded.toString().padStart(precision, '0');

  if (newFrac.length > precision) {
    const newInt = (Number(intPart) + 1).toString();
    newFrac = newFrac.slice(1);
    return (sign ? '-' : '') + newInt + (precision > 0 ? '.' + newFrac : '');
  }

  return (sign ? '-' : '') + intPart + (precision > 0 ? '.' + newFrac : '');
}

export function roundUp(value: NumberType, precision = 0) {
  const str = String(value);

  const sign = str.startsWith('-') ? '-' : '';
  const abs = sign ? str.slice(1) : str;

  const [intPart, frac = ''] = abs.split('.');

  if (precision === 0) return sign + (frac ? String(Number(intPart) + 1) : intPart);

  const kept = frac.slice(0, precision).padEnd(precision, '0');
  const rest = frac.slice(precision);

  if (!rest || /^0*$/.test(rest)) return sign + intPart + '.' + kept;

  let carry = 1;
  const digits = kept.split('');

  for (let i = digits.length - 1; i >= 0 && carry; i--) {
    const sum = Number(digits[i]) + carry;
    digits[i] = String(sum % 10);
    carry = Math.floor(sum / 10);
  }

  let resultInt = intPart;
  if (carry) resultInt = String(Number(resultInt) + 1);

  return sign + resultInt + '.' + digits.join('');
}

export function roundDown(value: NumberType, precision = 0): string {
  const str = String(value);

  const sign = str.startsWith('-') ? '-' : '';
  const abs = sign ? str.slice(1) : str;

  const [intPart, frac = ''] = abs.split('.');
  if (precision === 0) return sign + intPart;
  const kept = frac.slice(0, precision).padEnd(precision, '0');
  return sign + intPart + '.' + kept;
}

export function roundTruncate(value: NumberType, precision = 0): string {
  const str = String(value);

  const sign = str.startsWith('-') ? '-' : '';
  const abs = sign ? str.slice(1) : str;

  const [intPart, frac = ''] = abs.split('.');

  if (precision === 0) return sign + intPart;
  const kept = frac.slice(0, precision).padEnd(precision, '0');
  return sign + intPart + '.' + kept;
}

export function roundBanker(value: NumberType, precision = 0): string {
  const str = String(value);

  const sign = str.startsWith('-') ? '-' : '';
  const abs = sign ? str.slice(1) : str;

  const [intPart, frac = ''] = abs.split('.');

  const kept = frac.slice(0, precision).padEnd(precision, '0');
  const next = frac[precision];
  const rest = frac.slice(precision + 1);

  if (next === '5' && (!rest || /^0*$/.test(rest))) {
    const lastDigit = precision ? Number(kept[precision - 1]) : Number(intPart[intPart.length - 1]);
    if (lastDigit % 2 === 1) return roundUp(value, precision);
  } else if (next && next > '5') return roundUp(value, precision);

  return sign + intPart + (precision ? '.' + kept : '');
}

export function round(value: NumberType, options: RoundingConfigType = {}) {
  const mode = options.mode || 'half';
  const precision = options.precision || 0;

  switch (mode) {
    case 'half':
      return roundHalf(value, precision);

    case 'up':
      return roundUp(value, precision);

    case 'down':
      return roundDown(value, precision);

    case 'truncate':
      return roundTruncate(value, precision);

    case 'banker': {
      return roundBanker(value, precision);
    }
  }
}
