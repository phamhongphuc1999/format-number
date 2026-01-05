import { assert, describe, it } from 'vitest';
import { round } from '../src/index';

describe('Round number', () => {
  it('half', () => {
    let result = round(123.51456, { precision: 2 });
    assert.equal(result, '123.51');

    result = round(123.45, { precision: 1 });
    assert.equal(result, '123.5');

    result = round(-123.51, { precision: 1 });
    assert.equal(result, '-123.5');

    result = round(-123.45);
    assert.equal(result, '-123');

    result = round('123.456789', { precision: 9 });
    assert.equal(result, '123.456789');

    result = round('-123.456789', { precision: 3 });
    assert.equal(result, '-123.457');

    result = round(
      '-000000123456789876543212345678901234567898765432123456789012345678987654321234567890.456789',
      { precision: 3 },
    );
    assert.equal(
      result,
      '-123456789876543212345678901234567898765432123456789012345678987654321234567890.457',
    );
  });
  it('up', () => {
    let result = round(123.54, { precision: 1, rounding: 'up' });
    assert.equal(result, '123.6');

    result = round(-123.45, { precision: 1, rounding: 'up' });
    assert.equal(result, '-123.4');

    result = round(123.58, { precision: 1, rounding: 'up' });
    assert.equal(result, '123.6');

    result = round('123.5800001', { precision: 7, rounding: 'up' });
    assert.equal(result, '123.5800001');

    result = round('123.58000001', { precision: 7, rounding: 'up' });
    assert.equal(result, '123.5800001');

    result = round('123.99999999999999', { precision: 7, rounding: 'up' });
    assert.equal(result, '124');

    result = round('123.99', { precision: 7, rounding: 'up' });
    assert.equal(result, '123.99');

    result = round('123.58', { precision: 7, rounding: 'up' });
    assert.equal(result, '123.58');
  });
  it('down', () => {
    let result = round(123.54, { precision: 1, rounding: 'down' });
    assert.equal(result, '123.5');

    result = round(-123.45, { precision: 1, rounding: 'down' });
    assert.equal(result, '-123.5');

    result = round(-123.3, { precision: 1, rounding: 'down' });
    assert.equal(result, '-123.3');

    result = round(123.470000000002, { precision: 5, rounding: 'down' });
    assert.equal(result, '123.47');

    result = round(-123.470000000002, { precision: 5, rounding: 'down' });
    assert.equal(result, '-123.47001');
  });
  it('truncate', () => {
    let result = round(123.54, { precision: 1, rounding: 'truncate' });
    assert.equal(result, '123.5');

    result = round(-123.45, { precision: 1, rounding: 'truncate' });
    assert.equal(result, '-123.4');

    result = round(123.47, { precision: 1, rounding: 'truncate' });
    assert.equal(result, '123.4');
  });
  it('banker', () => {
    let result = round(123.54, { precision: 1, rounding: 'banker' });
    assert.equal(result, '123.5');

    result = round(-123.25, { precision: 1, rounding: 'banker' });
    assert.equal(result, '-123.2');

    result = round(123.46, { precision: 1, rounding: 'banker' });
    assert.equal(result, '123.5');
  });
});
