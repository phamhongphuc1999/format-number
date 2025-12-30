import { round } from './round';
import type { RoundingConfigType, NumberType } from './types';
import { removeZero } from './utils';

const configs = ['K', 'M', 'B', 'T', 'Q'];

export function compact(value: NumberType, options: RoundingConfigType = {}) {
  let str = removeZero(String(value));
  let sign = '';
  if (str.startsWith('-')) {
    str = str.slice(1);
    sign = '-';
  }
  let [intPart, fracPart = ''] = str.split('.');
  let len = intPart.length;
  let counter = -1;
  while (len > 3 && counter < 4) {
    const _intPart = intPart.slice(0, len - 3);
    fracPart = intPart.slice(len - 3) + fracPart;
    intPart = _intPart;
    len -= 3;
    counter++;
  }
  return round(`${sign}${intPart}.${fracPart}`, options) + (counter >= 0 ? configs[counter] : '');
}
