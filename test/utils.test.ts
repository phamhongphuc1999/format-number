import { assert, describe, it } from 'vitest';
import { removeZero } from '../src';

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
  });
});
