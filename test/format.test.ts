import { assert, describe, it } from 'vitest';
import { FN, createFormatFunction, formatNumber } from '../src';

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

    it('should allow notation none in chain', () => {
      const result = FN(12345).notation('none').toNumber();
      assert.equal(result, '12345');
    });

    it('should allow custom compact symbols in chain', () => {
      const result = FN(1000)
        .compact({ compactSymbols: ['k'] })
        .toNumber();
      assert.equal(result, '1k');
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

    it('should support fixed precision padding', () => {
      assert.equal(formatNumber(12.3, { precision: 3, fixed: true }), '12.300');
    });

    it('should allow notation none', () => {
      assert.equal(formatNumber(12345, { notation: 'none' }), '12345');
    });

    it('should handle string inputs with prefix and suffix', () => {
      assert.equal(
        formatNumber('12345.6', { precision: 1, prefix: '~', suffix: ' units' }),
        '~12345.6 units',
      );
    });
  });

  describe('createFormatFunction', () => {
    it('should return a reusable formatter', () => {
      const fmt = createFormatFunction({ prefix: '$', precision: 2, fixed: true });
      assert.equal(fmt(1.2), '$1.20');
      assert.equal(fmt(100), '$100.00');
    });
  });
});
