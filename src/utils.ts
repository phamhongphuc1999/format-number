export function removeZero(value: string) {
  const sign = value.startsWith('-') ? '-' : '';
  const abs = sign ? value.slice(1) : value;
  let _int = 0;
  let _frac = abs.length - 1;
  while (abs[_int] == '0' && _int < abs.length) _int++;
  const _index = value.indexOf('.');
  if (_index >= 0) while (abs[_frac] == '0' && _frac >= 0) _frac--;
  const _value = abs.slice(_int, _frac + 1);
  const _result = _value == '' || _value == '.' ? '0' : sign + _value;
  return _result.startsWith('.') ? `0${_result}` : _result;
}

export function formatSmallNum(value: string) {
  let str = removeZero(value);
  const sign = str.startsWith('-') ? '-' : '';
  str = sign ? str.slice(1) : str;
  const [intPart, fracPart = ''] = str.split('.');
  const leadingZeros = fracPart.match(/^0+/)?.[0]?.length || 0;
  const subscript = leadingZeros
    .toString()
    .split('')
    .map((digit) => String.fromCharCode(0x2080 + parseInt(digit)))
    .join('');
  const trimmedDecimal = fracPart.slice(leadingZeros);
  return `${intPart}.0${subscript}${trimmedDecimal}`;
}

export function formatScientific(value: string) {
  let str = removeZero(value);
  if (str === '0') return '0';
  const sign = str.startsWith('-') ? '-' : '';
  str = sign ? str.slice(1) : str;

  const [intPart, fracPart = ''] = str.split('.');

  if (intPart !== '0') {
    const exponent = intPart.length - 1;
    const mantissa = intPart[0] + '.' + (intPart.slice(1) + fracPart).replace(/0+$/, '');

    return `${sign}${mantissa}${mantissa.length > 1 ? '' : ''}e+${exponent}`;
  }
  const firstNonZero = fracPart.search(/[1-9]/);
  if (firstNonZero === -1) return '0';

  const exponent = -(firstNonZero + 1);
  const mantissa =
    fracPart[firstNonZero] + '.' + fracPart.slice(firstNonZero + 1).replace(/0+$/, '');

  return `${sign}${mantissa}e${exponent - 1}`;
}
