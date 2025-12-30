export function removeZero(value: string) {
  const sign = value.startsWith('-') ? '-' : '';
  const abs = sign ? value.slice(1) : value;
  let _int = 0;
  let _frac = abs.length - 1;
  while (abs[_int] == '0' && _int < abs.length) _int++;
  const _index = value.indexOf('.');
  if (_index >= 0) while (abs[_frac] == '0' && _frac >= 0) _frac--;
  const _value = abs.slice(_int, _frac + 1);
  return _value == '' || _value == '.' ? '0' : sign + _value;
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
