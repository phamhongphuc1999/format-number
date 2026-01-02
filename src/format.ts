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

export function formatNumber(value: NumberType, options?: MetadataType) {
  let result = String(value);
  if (options.isCompact == true) result = compact(result, options);
  else if (!options.isSmall) result = round(result, options);
  return _formatOtherNumber(result, options);
}

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
