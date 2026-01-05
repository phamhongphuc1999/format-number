import { assert, describe, it } from 'vitest';
import { parseNum, clearTrailingZero } from '../src';

describe('IO test', () => {
  it('clearTrailingZero', () => {
    let result = clearTrailingZero('00112300.0012300');
    assert.equal(result, '112300.00123');
    result = clearTrailingZero('-00112300.0012300');
    assert.equal(result, '-112300.00123');
  });
  it('parseNum', () => {
    let result = parseNum(123.45);
    assert.equal(result, '123.45');
    result = parseNum(-123.45);
    assert.equal(result, '-123.45');
    result = parseNum('--+123,456.567');
    assert.equal(result, '123456.567');
    result = parseNum(1234567890123456789012345n);
    assert.equal(result, '1234567890123456789012345');
    result = parseNum('$123.45');
    assert.equal(result, '123.45');
    result = parseNum('$123.45M');
    assert.equal(result, '123450000');
    result = parseNum('1.2e-6');
    assert.equal(result, '0.0000012');
    result = parseNum('@1,,1#234.564**4');
    assert.equal(result, '11');
    result = parseNum('5.0₄6');
    assert.equal(result, '5.00006');
    result = parseNum('-5.0₄6');
    assert.equal(result, '-5.00006');
    result = parseNum('5.45K');
    assert.equal(result, '5450');
  });
});
