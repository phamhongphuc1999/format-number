import { assert, describe, it } from 'vitest';
import { compact } from '../src';

describe('Compacting Tests', () => {
  it('should handle small numbers (no suffix)', () => {
    assert.equal(compact(123), '123');
    assert.equal(compact(999), '999');
  });

  it('should apply K suffix for thousands', () => {
    assert.equal(compact(1000), '1K');
    assert.equal(compact(1500), '1.5K');
    assert.equal(compact(999999), '999.999K');
  });

  it('should apply M suffix for millions', () => {
    assert.equal(compact(1000000), '1M');
    assert.equal(compact(1234567), '1.234567M');
  });

  it('should apply B suffix for billions', () => {
    assert.equal(compact(1000000000), '1B');
  });

  it('should apply T suffix for trillions', () => {
    assert.equal(compact(1000000000000), '1T');
  });

  it('should apply Q suffix for quadrillions and beyond', () => {
    assert.equal(compact(1000000000000000), '1Q');
    // Beyond Q, it keeps Q but shows the larger absolute value
    assert.equal(compact('1000000000000000000'), '1000Q');
  });

  it('should handle negative numbers', () => {
    assert.equal(compact(-1500), '-1.5K');
    assert.equal(compact(-1000000), '-1M');
  });

  it('should respect precision and rounding options', () => {
    assert.equal(compact(1234567, { precision: 2 }), '1.23M');
    assert.equal(compact(1235567, { precision: 2, rounding: 'half' }), '1.24M');
    assert.equal(compact(1235567, { precision: 2, rounding: 'down' }), '1.23M');
  });

  it('should handle string and bigint inputs', () => {
    assert.equal(compact('1500.5'), '1.5005K');
    assert.equal(compact(1000000n), '1M');
  });
});
