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

/**
 * Fluent API interface for chainable number formatting operations.
 */
export type FNType = {
  /**
   * Rounds the number based on the provided precision and strategy.
   * @param options - Rounding configuration (precision, rounding strategy).
   * @returns The same FNType instance for further chaining.
   */
  round(options?: RoundingConfigType): FNType;

  /**
   * Converts the number to a compact representation (e.g., 1K, 1M, 1B).
   * @param options - Optional rounding configuration to apply during compaction.
   * @returns The same FNType instance for further chaining.
   */
  compact(options?: RoundingConfigType): FNType;

  /**
   * Sets the notation style for the number (e.g., scientific, subscript).
   * @param mode - The notation mode to use. Defaults to 'scientific'.
   * @returns The same FNType instance for further chaining.
   */
  notation(mode?: NotationMode): FNType;

  /**
   * Adds a prefix to the formatted number string.
   * @param symbol - The string to prepend.
   * @returns The same FNType instance for further chaining.
   */
  prefix(symbol: string): FNType;

  /**
   * Adds a suffix to the formatted number string.
   * @param symbol - The string to append.
   * @returns The same FNType instance for further chaining.
   */
  suffix(symbol: string): FNType;

  /**
   * Finalizes the chain and returns the formatted number as a string.
   * @returns The final formatted number string.
   */
  toNumber(): string;

  /**
   * Returns the internal state of the number as an ObjectNumberType.
   * @returns The internal object representation.
   */
  toObject(): ObjectNumberType;
};
