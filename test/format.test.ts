import { assert, describe, it } from 'vitest';
import { FN, formatNumber } from '../src';

describe('Formatting Entry Points', () => {
  describe('FN (Fluent API)', () => {
    it('should support basic chaining', () => {
      const result = FN('1234567.89').round({ precision: 0 }).prefix('$').toNumber();
      assert.equal(result, '$1234568');
    });

    it('should support compacting in chain', () => {
      const result = FN(1000000).compact().suffix(' total').toNumber();
      assert.equal(result, '1M total');
    });

    it('should support complex multi-step chains', () => {
      const result = FN('123415678.987654321')
        .compact({ rounding: 'down', precision: 4 })
        .prefix('$')
        .round({ rounding: 'up', precision: 1 })
        .suffix(' Token')
        .toNumber();
      assert.equal(result, '$123.5M Token');
    });

    it('should expose internal state via toObject', () => {
      const obj = FN(1500).prefix('~').compact().toObject();
      assert.equal(obj.intPart, '1');
      assert.equal(obj.fracPart, '5');
      assert.equal(obj.compactedSymbol, 'K');
      assert.equal(obj.prefix, '~');
      assert.equal(obj.sign, '');
    });

    it('should handle notation in chain', () => {
      const result = FN(0.00001).notation('subscript').toNumber();
      assert.equal(result, '0.0₄1');
    });
  });

  describe('formatNumber (One-off API)', () => {
    it('should combine options correctly', () => {
      assert.equal(formatNumber(1234.56, { prefix: '$', precision: 1 }), '$1234.6');
      assert.equal(
        formatNumber(1500000, { isCompact: true, notation: 'scientific', precision: 1 }),
        '1.5M',
      );
    });

    it('should handle empty options', () => {
      assert.equal(formatNumber(123.45), '123');
    });
  });
});
