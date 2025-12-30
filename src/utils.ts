export function removeZero(value: string) {
  const sign = value.startsWith('-') ? '-' : '';
  const abs = sign ? value.slice(1) : value;
  let _int = 0;
  let _frac = abs.length - 1;
  while (abs[_int] == '0' && _int < abs.length) _int++;
  while (abs[_frac] == '0' && _frac >= 0) _frac--;
  const _value = abs.slice(_int, _frac + 1);
  return _value == '' || _value == '.' ? '0' : sign + _value;
}
