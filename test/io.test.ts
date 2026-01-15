/* eslint-disable @typescript-eslint/no-explicit-any */
import { assert, describe, it } from 'vitest';
import { clearTrailingZero, parseNum } from '../src';
import { convertToObjectNumber } from '../src/io';

describe('IO Utility Tests', () => {
  describe('clearTrailingZero', () => {
    it('should remove leading zeros correctly', () => {
      assert.equal(clearTrailingZero('00123'), '123');
      assert.equal(clearTrailingZero('000.123'), '0.123');
      assert.equal(clearTrailingZero('-00123'), '-123');
    });

    it('should remove trailing zeros in decimal part', () => {
      assert.equal(clearTrailingZero('123.4500'), '123.45');
      assert.equal(clearTrailingZero('123.000'), '123');
      assert.equal(clearTrailingZero('-123.4500'), '-123.45');
    });

    it('should handle zero values correctly', () => {
      assert.equal(clearTrailingZero('0.000'), '0');
      assert.equal(clearTrailingZero('000'), '0');
    });

    it('should not remove zeros in the middle', () => {
      assert.equal(clearTrailingZero('100.001'), '100.001');
      assert.equal(clearTrailingZero('102030'), '102030');
    });
  });

  describe('parseNum', () => {
    it('should handle basic types', () => {
      assert.equal(parseNum(123.45), '123.45');
      assert.equal(parseNum(12345678901234567890n), '12345678901234567890');
      assert.equal(parseNum('123.45'), '123.45');
    });

    it('should handle sign variations', () => {
      assert.equal(parseNum('+123.45'), '123.45');
      assert.equal(parseNum('-123.45'), '-123.45');
      assert.equal(parseNum('--123.45'), '123.45');
      assert.equal(parseNum('---123.45'), '-123.45');
      assert.equal(parseNum('+-+123.45'), '-123.45');
    });

    it('should handle currency and separators', () => {
      assert.equal(parseNum('$1,234.56'), '1234.56');
      assert.equal(parseNum('€1_234_567.89'), '1234567.89');
      assert.equal(parseNum('£ 1 234 . 56'), '1234.56');
      assert.equal(parseNum('¥12,345'), '12345');
    });

    it('should handle large number suffixes', () => {
      assert.equal(parseNum('1.5K'), '1500');
      assert.equal(parseNum('1.5M'), '1500000');
      assert.equal(parseNum('1.5B'), '1500000000');
      assert.equal(parseNum('1.5T'), '1500000000000');
      assert.equal(parseNum('1.5Q'), '1500000000000000');
    });

    it('should handle scientific notation', () => {
      assert.equal(parseNum('1.2e3'), '1200');
      assert.equal(parseNum('1.2e-3'), '0.0012');
      assert.equal(parseNum('1.2E+3'), '1200');
    });

    it('should handle combined suffixes and scientific notation', () => {
      // 1.2e2 K = 120 * 1000 = 120000
      assert.equal(parseNum('1.2e2K'), '120000');
    });

    it('should handle subscript notation', () => {
      assert.equal(parseNum('5.0₄6'), '5.00006');
      assert.equal(parseNum('-5.0₄6'), '-5.00006');
      assert.equal(parseNum('0.0₅123'), '0.00000123');
      // Multiple subscripts
      assert.equal(parseNum('0.0₂₀'), '0');
    });

    it('should handle edge cases and invalid strings', () => {
      assert.equal(parseNum(''), '0');
      assert.equal(parseNum('   '), '0');
      assert.equal(parseNum(null as any), '0');
      assert.equal(parseNum(undefined as any), '0');
      assert.equal(parseNum('abc'), '--');
      assert.equal(parseNum('abc', { fallback: 'NaN' }), 'NaN');
      assert.equal(parseNum('@1,,1#234.564**4'), '11');
      assert.equal(parseNum('.5'), '0.5');
      assert.equal(parseNum('1.'), '1');
    });
  });

  describe('convertToObjectNumber', () => {
    it('should convert primitive types correctly', () => {
      assert.deepEqual(convertToObjectNumber(123), { sign: '', value: '123' });
      assert.deepEqual(convertToObjectNumber(-123.45), { sign: '-', value: '123.45' });
      assert.deepEqual(convertToObjectNumber('00123.4500'), { sign: '', value: '123.45' });
      assert.deepEqual(convertToObjectNumber(100n), { sign: '', value: '100' });
    });

    it('should return ObjectNumberType as-is', () => {
      const obj = { sign: '-' as const, value: '123', prefix: '$' };
      assert.strictEqual(convertToObjectNumber(obj as any), obj);
    });
  });
});
