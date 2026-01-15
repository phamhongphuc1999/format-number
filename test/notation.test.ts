import { assert, describe, it } from 'vitest';
import { scientific, subscript } from '../src';

describe('Notation Tests', () => {
  describe('subscript', () => {
    it('should format small numbers using subscript notation', () => {
      assert.equal(subscript('0.000123'), '0.0₃123');
      assert.equal(subscript('0.000000000012'), '0.0₁₀12');
    });

    it('should handle negative numbers', () => {
      assert.equal(subscript('-0.001'), '-0.0₂1');
    });

    it('should handle no leading zeros correctly', () => {
      assert.equal(subscript('0.123'), '0.0₀123');
    });
  });

  describe('scientific', () => {
    it('should format large numbers in scientific notation', () => {
      assert.equal(scientific('12345'), '1.2345e+4');
      assert.equal(scientific('1000000'), '1e+6');
    });

    it('should format small numbers in scientific notation', () => {
      assert.equal(scientific('0.000123'), '1.23e-4');
      assert.equal(scientific('0.000000123'), '1.23e-7');
    });

    it('should handle zero', () => {
      assert.equal(scientific('0'), '0');
    });

    it('should handle negative numbers', () => {
      assert.equal(scientific('-123.45'), '-1.2345e+2');
      assert.equal(scientific('-0.00123'), '-1.23e-3');
    });

    it('should not use scientific notation if exponent is 0', () => {
      assert.equal(scientific('1.23'), '1.23');
    });
  });
});
