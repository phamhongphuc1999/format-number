import { assert, describe, it } from 'vitest';
import { formatSmallNum, removeZero } from '../src';

describe('utils', () => {
  it('removeZero', () => {
    let result = removeZero('000123.45678000000');
    assert.equal(result, '123.45678');

    result = removeZero('000000.00000');
    assert.equal(result, '0');

    result = removeZero('-000000.00000');
    assert.equal(result, '0');

    result = removeZero('-000123.45678000000');
    assert.equal(result, '-123.45678');

    result = removeZero('-0001234567000000000');
    assert.equal(result, '-1234567000000000');
  });
  it('formatSmallNum', () => {
    let result = formatSmallNum('000123.000000000012');
    assert.equal(result, '123.0₁₀12');

    result = formatSmallNum('-000123.0000000012');
    assert.equal(result, '123.0₈12');
  });
});
