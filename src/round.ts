import { getBaseNumberNumber, getStandardOutput } from './io';
import type {
  BaseObjectNumberType,
  BasePositiveNumberType,
  NumberType,
  RoundingConfigType,
} from './types';

function increment(value: string) {
  if (!value) return { result: '', carry: true };
  const n = BigInt(value) + 1n;
  const s = n.toString();
  if (s.length > value.length) return { result: s.slice(1), carry: true };
  return { result: s.padStart(value.length, '0'), carry: false };
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
  const precision = options.precision || 0;
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

  return { sign, ...res };
}

export function round(value: NumberType, options: RoundingConfigType = {}): string {
  const result = _round(getBaseNumberNumber(value), options);
  return getStandardOutput(result);
}
