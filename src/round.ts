import { getBaseNumberNumber, getStandardOutput } from './io';
import type {
  BaseObjectNumberType,
  BasePositiveNumberType,
  NumberType,
  RoundingConfigType,
} from './types';

function increment(value: string) {
  if (!value) return { result: '', carry: true };
  const len = value.length;
  let carry = 1;
  const out = new Array<string>(len);
  for (let i = len - 1; i >= 0; i--) {
    const digit = value.charCodeAt(i) - 48 + carry;
    if (digit >= 10) {
      out[i] = '0';
      carry = 1;
    } else {
      out[i] = String.fromCharCode(48 + digit);
      carry = 0;
    }
  }
  return { result: out.join(''), carry: carry === 1 };
}

function incInt({ intPart }: BasePositiveNumberType): BasePositiveNumberType {
  const { result, carry } = increment(intPart);
  return { intPart: carry ? '1' + result : result, fracPart: '' };
}

export function roundPosHalf(value: BasePositiveNumberType, precision = 0): BasePositiveNumberType {
  const { intPart, fracPart } = value;
  if (!fracPart || precision >= fracPart.length) return value;

  const digit = parseInt(fracPart[precision], 10);
  if (digit >= 5) {
    if (precision === 0) return incInt(value);
    const roundFrac = fracPart.slice(0, precision);
    const { result, carry } = increment(roundFrac);
    return carry ? incInt(value) : { intPart, fracPart: result };
  }
  return { intPart, fracPart: fracPart.slice(0, precision) };
}

function roundPosUp(value: BasePositiveNumberType, precision = 0): BasePositiveNumberType {
  const { intPart, fracPart } = value;
  if (!fracPart || precision >= fracPart.length) return value;
  if (precision === 0) return incInt(value);
  const roundFrac = fracPart.slice(0, precision);
  const { result, carry } = increment(roundFrac);
  return carry ? incInt(value) : { intPart, fracPart: result };
}

function roundPosDown(value: BasePositiveNumberType, precision = 0): BasePositiveNumberType {
  const { intPart, fracPart } = value;
  if (!fracPart || precision >= fracPart.length) return value;
  const res = fracPart.slice(0, precision);
  return { intPart, fracPart: res.replace(/0+$/, '') };
}

function roundPosBanker(value: BasePositiveNumberType, precision = 0): BasePositiveNumberType {
  const { intPart, fracPart } = value;
  if (!fracPart || precision >= fracPart.length) return value;

  const digit = parseInt(fracPart[precision], 10);
  const rest = fracPart.slice(precision + 1).replace(/0+$/, '');
  const isHalf = digit === 5 && rest === '';

  let shouldUp = false;
  if (digit > 5 || (digit === 5 && rest !== '')) {
    shouldUp = true;
  } else if (isHalf) {
    const prevDigit = precision === 0 ? intPart[intPart.length - 1] : fracPart[precision - 1];
    if (parseInt(prevDigit, 10) % 2 !== 0) shouldUp = true;
  }
  if (shouldUp) {
    if (precision === 0) return incInt(value);
    const { result, carry } = increment(fracPart.slice(0, precision));
    return carry ? incInt(value) : { intPart, fracPart: result };
  }
  return { intPart, fracPart: fracPart.slice(0, precision) };
}

export function _round(
  value: BaseObjectNumberType,
  options: RoundingConfigType = {},
): BaseObjectNumberType {
  const mode = options.rounding || 'half';
  const precision = Math.max(0, options.precision ?? 0);
  const fixed = options.fixed === true;
  const { sign, intPart, fracPart } = value;
  const posVal = { intPart, fracPart };

  let res: BasePositiveNumberType;

  switch (mode) {
    case 'half':
      res = roundPosHalf(posVal, precision);
      break;
    case 'up':
      res = sign ? roundPosDown(posVal, precision) : roundPosUp(posVal, precision);
      break;
    case 'down':
      res = sign ? roundPosUp(posVal, precision) : roundPosDown(posVal, precision);
      break;
    case 'truncate':
      res = roundPosDown(posVal, precision);
      break;
    case 'banker':
      res = roundPosBanker(posVal, precision);
      break;
    default:
      res = roundPosHalf(posVal, precision);
  }

  let nextFrac = res.fracPart;
  if (fixed && precision > 0) nextFrac = nextFrac.padEnd(precision, '0');
  if (fixed && precision === 0) nextFrac = '';
  return { sign, intPart: res.intPart, fracPart: nextFrac };
}

export function round(value: NumberType, options: RoundingConfigType = {}): string {
  const result = _round(getBaseNumberNumber(value), options);
  return getStandardOutput(result);
}
