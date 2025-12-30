import { assert, describe, it } from 'vitest';
import { FN, formatNumber } from '../src';

describe('FN', () => {
  it('FN only round function', () => {
    const result = FN('123.456')
      .round({ mode: 'down', precision: 1 })
      .round({ mode: 'up', precision: 8 })
      .toString();
    assert.equal(result, '123.4');
  });
  it('FN round and compact function', () => {
    const result = FN('123456789.987654321')
      .round({ mode: 'down', precision: 2 })
      .compact({ precision: 1 });
    assert.equal(result, '123.5M');
  });
  it('FN format', () => {
    const result = FN(12345.55).format({ prefix: '$' });
    assert.equal(result, '$12345.55');
  });
  it('formatNumber', () => {
    let result = formatNumber(12345.67, { precision: 1, prefix: '$', suffix: '.' });
    assert.equal(result, '$12345.7.');

    result = formatNumber('12345.0000000000000067', {
      prefix: '$',
      suffix: '.',
      isSmall: true,
    });
    assert.equal(result, '$12345.0₁₄67.');
  });
});
