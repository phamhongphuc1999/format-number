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
  });
  it('up', () => {
    let result = round(123.54, { precision: 1, mode: 'up' });
    assert.equal(result, '123.6');

    result = round(-123.45, { precision: 1, mode: 'up' });
    assert.equal(result, '-123.5');

    result = round(123.58, { precision: 1, mode: 'up' });
    assert.equal(result, '123.6');
  });
  it('down', () => {
    let result = round(123.54, { precision: 1, mode: 'down' });
    assert.equal(result, '123.5');

    result = round(-123.45, { precision: 1, mode: 'down' });
    assert.equal(result, '-123.4');

    result = round(123.47, { precision: 1, mode: 'down' });
    assert.equal(result, '123.4');
  });
  it('truncate', () => {
    let result = round(123.54, { precision: 1, mode: 'truncate' });
    assert.equal(result, '123.5');

    result = round(-123.45, { precision: 1, mode: 'truncate' });
    assert.equal(result, '-123.4');

    result = round(123.47, { precision: 1, mode: 'truncate' });
    assert.equal(result, '123.4');
  });
  it('banker', () => {
    let result = round(123.54, { precision: 1, mode: 'banker' });
    assert.equal(result, '123.5');

    result = round(-123.45, { precision: 1, mode: 'banker' });
    assert.equal(result, '-123.4');

    result = round(123.55, { precision: 1, mode: 'banker' });
    assert.equal(result, '123.6');
  });
});
