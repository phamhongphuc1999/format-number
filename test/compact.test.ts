import { assert, describe, it } from 'vitest';
import { compact } from '../src';

describe('Compact', () => {
  it('Compact function with unit', () => {
    let result = compact('1234567890', { precision: 2 });
    assert.equal(result, '1.23B');

    result = compact('1234567891234', { precision: 3 });
    assert.equal(result, '1.235T');

    result = compact('12345678', { precision: 3 });
    assert.equal(result, '12.346M');

    result = compact('12345678912345678', { precision: 3 });
    assert.equal(result, '12.346Q');

    result = compact('123456789123456789012', { precision: 3 });
    assert.equal(result, '123456.789Q');

    result = compact('123456789123456789012');
    assert.equal(result, '123456.789123456789012Q');

    result = compact('123');
    assert.equal(result, '123');
  });
});
