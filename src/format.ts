import { _compact } from './compact';
import { convertToObjectNumber } from './io';
import { scientific, subscript } from './notation';
import { round } from './round';
import type {
  FNType,
  FormattingConfigType,
  NotationMode,
  NumberType,
  ObjectNumberType,
  RoundingConfigType,
} from './types';

function _FN(value: ObjectNumberType): FNType {
  return {
    round: (options?: RoundingConfigType) => {
      const roundedValue = round(value.value, options);
      return _FN({ ...value, value: roundedValue });
    },
    compact: (options?: RoundingConfigType) => {
      if (value.compactedSymbol) return _FN(value);
      const { value: compactedValue, symbol: compactedSymbol } = _compact(value.value, options);
      return _FN({ ...value, compactedSymbol, value: compactedValue });
    },
    notation(mode: NotationMode = 'scientific') {
      return _FN({ ...value, notation: mode });
    },
    prefix(symbol: string) {
      return _FN({ ...value, prefix: symbol });
    },
    suffix(symbol: string) {
      return _FN({ ...value, suffix: symbol });
    },
    toNumber() {
      let { value: result } = value;
      const { sign, prefix, suffix, compactedSymbol } = value;
      if (value.notation == 'scientific') result = scientific(result);
      else if (value.notation == 'subscript') result = subscript(result);
      return `${prefix || ''}${sign}${result}${compactedSymbol || ''}${suffix || ''}`;
    },
    toObject() {
      return value;
    },
  };
}

/**
 * Fluent API for performing multiple formatting operations in a readable chain.
 * Wraps the input value into a formatter object that supports rounding,
 * compacting, notation, prefixes, and suffixes.
 *
 * @param value - The initial value to format, can be a number, string, or bigint.
 * @returns A chainable `FNType` object.
 *
 * @example
 * FN('1234567.89')
 *   .round({ precision: 0 })
 *   .prefix('$')
 *   .toNumber(); // '$1234568'
 *
 * @example
 * FN(1000000)
 *   .compact()
 *   .suffix(' total')
 *   .toNumber(); // '1M total'
 */
export function FN(value: NumberType | ObjectNumberType) {
  return _FN(convertToObjectNumber(value));
}

/**
 * Comprehensive formatting function that combines rounding, compacting, and metadata.
 * This is the quickest way to format a number with multiple options in a single call.
 *
 * @param value - The value to format (number, string, or bigint).
 * @param options - Formatting configuration (precision, rounding strategy, compact mode, prefix, suffix, and notation style).
 * @returns The final formatted number string.
 *
 * @example
 * formatNumber(1234.56, { prefix: '$', precision: 1 }); // '$1234.6'
 *
 * @example
 * formatNumber(1500000, { isCompact: true, notation: 'scientific' }); // '1.5M' (compacted before potential notation)
 */
export function formatNumber(value: NumberType, options?: FormattingConfigType) {
  let result = FN(value).round(options);
  if (options.isCompact) result = result.compact(options);
  if (options.notation) result = result.notation(options.notation);
  if (options.prefix) result = result.prefix(options.prefix);
  if (options.suffix) result = result.suffix(options.suffix);
  return result.toNumber();
}
