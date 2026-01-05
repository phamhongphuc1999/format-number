import { assert, describe, it } from 'vitest';
import { scientific, subscript } from '../src';

describe('utils', () => {
  it('formatSmallNum', () => {
    let result = subscript('000123.000000000012');
    assert.equal(result, '123.0₁₀12');
    result = subscript('-000123.0000000012');
    assert.equal(result, '-123.0₈12');
  });
  it('formatScientific', () => {
    let result = scientific('12345.6789');
    assert.equal(result, '1.23456789e+4');
    result = scientific('0.0000123');
    assert.equal(result, '1.23e-6');
    result = scientific('1.2');
    assert.equal(result, '1.2');
  });
});
