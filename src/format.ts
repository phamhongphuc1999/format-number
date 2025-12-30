import { compact } from './compact';
import { round } from './round';
import type { MetadataType, NumberType, OtherMetadataType, RoundingConfigType } from './types';
import { formatSmallNum } from './utils';

export function formatNumber(value: NumberType, options?: MetadataType) {
  let result = String(value);
  if (options.isCompact == true) result = compact(result, options);
  else if (!options.isSmall) result = round(result, options);
  const prefix = options.prefix || '';
  const suffix = options.suffix || '';
  const isSmall = options.isSmall || false;
  return `${prefix}${isSmall ? formatSmallNum(result) : result}${suffix}`;
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
      const prefix = options.prefix || '';
      const suffix = options.suffix || '';
      const isSmall = options.isSmall || false;
      return `${prefix}${isSmall ? formatSmallNum(String(value)) : value}${suffix}`;
    },
    toString() {
      return String(value);
    },
  };
}
