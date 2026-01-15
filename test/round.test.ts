import { assert, describe, it } from 'vitest';
import { round } from '../src';

describe('Rounding Tests', () => {
  describe('half (default)', () => {
    it('should round to nearest (>= 0.5 up)', () => {
      assert.equal(round(1.234, { precision: 2 }), '1.23');
      assert.equal(round(1.235, { precision: 2 }), '1.24');
      assert.equal(round(1.236, { precision: 2 }), '1.24');
    });

    it('should handle negative numbers', () => {
      assert.equal(round(-1.234, { precision: 2 }), '-1.23');
      assert.equal(round(-1.235, { precision: 2 }), '-1.24');
      assert.equal(round(-1.236, { precision: 2 }), '-1.24');
    });

    it('should round to integer by default', () => {
      assert.equal(round(1.4), '1');
      assert.equal(round(1.5), '2');
      assert.equal(round(-1.4), '-1');
      assert.equal(round(-1.5), '-2');
    });

    it('should handle large numbers', () => {
      const large = '12345678987654321234567890.456789';
      assert.equal(round(large, { precision: 3 }), '12345678987654321234567890.457');
    });
  });

  describe('up', () => {
    it('should round towards positive infinity (positive numbers)', () => {
      assert.equal(round(1.231, { rounding: 'up', precision: 2 }), '1.24');
      assert.equal(round(1.23, { rounding: 'up', precision: 2 }), '1.23');
    });

    it('should round towards positive infinity (negative numbers)', () => {
      // -1.231 rounds UP to -1.23
      assert.equal(round(-1.239, { rounding: 'up', precision: 2 }), '-1.23');
    });

    it('should handle carry over', () => {
      assert.equal(round('123.99999999999999', { precision: 7, rounding: 'up' }), '124');
    });
  });

  describe('down', () => {
    it('should round towards negative infinity (positive numbers)', () => {
      assert.equal(round(1.239, { rounding: 'down', precision: 2 }), '1.23');
    });

    it('should round towards negative infinity (negative numbers)', () => {
      // -1.231 rounds DOWN to -1.24
      assert.equal(round(-1.231, { rounding: 'down', precision: 2 }), '-1.24');
    });
  });

  describe('truncate', () => {
    it('should round towards zero', () => {
      assert.equal(round(1.239, { rounding: 'truncate', precision: 2 }), '1.23');
      assert.equal(round(-1.239, { rounding: 'truncate', precision: 2 }), '-1.23');
    });
  });

  describe('banker', () => {
    it('should round to nearest even neighbor on 0.5', () => {
      // Rounds to even
      assert.equal(round(1.5, { rounding: 'banker' }), '2');
      assert.equal(round(2.5, { rounding: 'banker' }), '2');
      assert.equal(round(3.5, { rounding: 'banker' }), '4');
      assert.equal(round(4.5, { rounding: 'banker' }), '4');
    });

    it('should handle precision with banker rounding', () => {
      assert.equal(round(1.225, { rounding: 'banker', precision: 2 }), '1.22');
      assert.equal(round(1.235, { rounding: 'banker', precision: 2 }), '1.24');
    });

    it('should handle negative numbers with banker rounding', () => {
      assert.equal(round(-1.5, { rounding: 'banker' }), '-2');
      assert.equal(round(-2.5, { rounding: 'banker' }), '-2');
    });

    it('should round normally if not exactly 0.5', () => {
      assert.equal(round(2.51, { rounding: 'banker' }), '3');
      assert.equal(round(2.49, { rounding: 'banker' }), '2');
    });
  });

  describe('precision edge cases', () => {
    it('should handle high precision', () => {
      assert.equal(round(1.2, { precision: 5 }), '1.2');
    });

    it('should handle zero precision', () => {
      assert.equal(round(1.9, { precision: 0 }), '2');
    });

    it('should carry over digits (plusOne logic)', () => {
      assert.equal(round(9.99, { precision: 1 }), '10');
      assert.equal(round(0.999, { precision: 2 }), '1');
    });
  });
});
