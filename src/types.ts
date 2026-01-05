/** Supported input types for number formatting */
export type NumberType = number | string | bigint;

/** Strategies for rounding numbers */
export type RoundingMode = 'half' | 'up' | 'down' | 'banker' | 'truncate';

/** Modes for special numerical notation */
export type NotationMode = 'subscript' | 'scientific';

/** Possible sign values for internal number representation */
export type SignType = '-' | '';

/** Configuration for rounding operations */
export type RoundingConfigType = Partial<{
  /** The rounding strategy to use */
  rounding: RoundingMode;
  /** Number of decimal places to keep */
  precision: number;
}>;

/** Configuration for basic number display properties */
export type NumberConfigType = Partial<{
  /** Text to prepend to the number (e.g., '$') */
  prefix: string;
  /** Text to append to the number (e.g., ' units') */
  suffix: string;
  /** The notation style to apply */
  notation: NotationMode;
}>;

/** Internal object structure containing full formatting state */
export type ObjectNumberType = { sign: SignType; value: string } & NumberConfigType &
  Partial<{
    /** The symbol used for compact notation (e.g., 'K', 'M') */
    compactedSymbol: string;
  }>;

/** Full configuration options for the formatNumber function */
export type FormattingConfigType = RoundingConfigType &
  NumberConfigType &
  Partial<{
    /** Whether to use compact notation (K, M, B, etc.) */
    isCompact: boolean;
  }>;
