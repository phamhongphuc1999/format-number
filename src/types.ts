/** Supported input types for number formatting */
export type NumberType = number | string | bigint;

/** Strategies for rounding numbers */
export type RoundingMode = 'half' | 'up' | 'down' | 'banker' | 'truncate';

/** Configuration for rounding operations */
export type RoundingConfigType = Partial<{ 
  /** The rounding strategy to use */
  mode: RoundingMode; 
  /** Number of decimal places to keep */
  precision: number 
}>;

/** Metadata for adding prefix, suffix or special notations */
export type OtherMetadataType = Partial<{
  /** Text to prepend to the number */
  prefix: string;
  /** Text to append to the number */
  suffix: string;
  /** Whether to use subscript notation for small numbers */
  isSmall: boolean;
  /** Whether to use scientific notation for very large/small numbers */
  isScientific: boolean;
}>;

/** Complete configuration for the formatNumber function */
export type MetadataType = RoundingConfigType & OtherMetadataType & Partial<{ 
  /** Whether to use compact notation (K, M, B, etc.) */
  isCompact: boolean 
}>;
