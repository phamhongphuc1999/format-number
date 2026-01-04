import { compact } from './compact';
import { round } from './round';
import type { MetadataType, NumberType, OtherMetadataType, RoundingConfigType } from './types';
import { formatScientific, formatSmallNum } from './utils';

function _formatOtherNumber(value: string, options?: OtherMetadataType) {
  const prefix = options.prefix || '';
  const suffix = options.suffix || '';
  const isSmall = options.isSmall || false;
  const isScientific = options.isScientific || false;
  const _value = isScientific ? formatScientific(value) : value;
  return `${prefix}${isSmall ? formatSmallNum(_value) : _value}${suffix}`;
}

/**
 * A comprehensive function for formatting numbers with rounding, compacting, and custom metadata.
 * 
 * @param value - The value to format. Can be a number, string, or bigint.
 * @param options - Configuration options for formatting.
 * @param options.precision - Number of decimal places (default: 0).
 * @param options.mode - Rounding strategy (default: 'half').
 * @param options.prefix - Text to prepend to the result (e.g., '$').
 * @param options.suffix - Text to append to the result (e.g., ' units').
 * @param options.isCompact - If true, formats using K/M/B/T suffixes.
 * @param options.isSmall - If true, formats tiny numbers using subscript notation (e.g., 0.0₃5).
 * @returns The formatted number as a string.
 * 
 * @example
 * formatNumber(1234.56, { prefix: '$', precision: 1 }); // '$1234.6'
 * formatNumber(1500000, { isCompact: true }); // '1.5M'
 */
export function formatNumber(value: NumberType, options?: MetadataType) {
  let result = String(value);
  if (options.isCompact == true) result = compact(result, options);
  else if (!options.isSmall) result = round(result, options);
  return _formatOtherNumber(result, options);
}

/**
 * Fluent/Chained API for performing multiple formatting operations in a readable way.
 * 
 * @param value - The initial value to start the chain.
 * @returns An object with chainable formatting methods.
 * 
 * @example
 * FN('1234567.89')
 *   .round({ precision: 0 })
 *   .format({ prefix: 'Total: ', suffix: ' tokens' }); // 'Total: 1234568 tokens'
 */
export function FN(value: NumberType) {
  return {
    round(options: RoundingConfigType = {}) {
      return FN(round(value, options));
    },
    compact(options: RoundingConfigType = {}) {
      return compact(value, options);
    },
    format(options: OtherMetadataType = {}) {
      return _formatOtherNumber(String(value), options);
    },
    toString() {
      return String(value);
    },
  };
}
