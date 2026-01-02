# format-number

A lightweight, high-precision JavaScript/TypeScript library for rounding and formatting numbers. It handles everything from large financial figures and crypto balances to extremely small fractions with scientific subscripts.

Designed for precision-critical applications where numbers often exceed safe integer limits.

For detailed documentation and advanced usage, visit: [here](https://blog.peter-present.xyz/format-number)

## Key Features

- **High Precision**: Native support for `string`, `number`, and `bigint` without loss of precision.
- **Multiple Rounding Modes**: 5 different strategies to handle rounding exactly how you need.
- **Compact Formatting**: Automatically shorten large numbers with suffixes (K, M, B, T, Q).
- **Small Number Notation**: Smart formatting for tiny numbers using subscript zeros (e.g., `0.0₃5`).
- **Flexible Metadata**: Easily add prefixes and suffixes (e.g., Currency symbols, Units).
- **Fluent API**: Chained operations for cleaner, more readable code.
- **Zero Dependencies**: Keeps your bundle size minimal.

## Installation

```shell
# npm
npm install @peter-present/format-number

# yarn
yarn add @peter-present/format-number

# bun
bun install @peter-present/format-number
```

## Core Functions

### Rounding: `round()`

Round numbers using specific strategies and precision.

```typescript
import { round } from 'format-number';

round(123.456, { precision: 2 }); // '123.46'
round(-123.45, { mode: 'up', precision: 1 }); // '-123.4' (Towards +Infinity)
```

### Compact Formatting: `compact()`

Format large numbers with readable suffixes.

```typescript
import { compact } from 'format-number';

compact(1500); // '1.5K'
compact(1200000, { precision: 1 }); // '1.2M'
compact('1000000000000'); // '1T'
```

### Advanced Formatting: `formatNumber()`

A comprehensive function combining rounding, compacting, and metadata.

```typescript
import { formatNumber } from 'format-number';

// Currency formatting
formatNumber(1234.56, { prefix: '$', precision: 1 }); // '$1234.6'

// Compact with metadata
formatNumber(1500000, { isCompact: true, suffix: ' units' }); // '1.5M units'

// Small number subscript notation
formatNumber(0.00005, { isSmall: true }); // '0.0₄5'
```

### Fluent / Chained API: `FN()`

Perform multiple operations in a readable chain.

```typescript
import { FN } from 'format-number';

const result = FN('1234567.89')
  .round({ precision: 0 })
  .format({ prefix: 'Total: ', suffix: ' tokens' });

console.log(result); // 'Total: 1234568 tokens'

// Compact chaining
FN(1000000).compact({ precision: 0 }); // '1M'
```

## API Reference

### Rounding Modes (`RoundingMode`)

| Mode       | Description                                                          |
| :--------- | :------------------------------------------------------------------- |
| `half`     | Round to the nearest neighbor. If equidistant, round away from zero. |
| `up`       | Round towards Positive Infinity.                                     |
| `down`     | Round towards Negative Infinity.                                     |
| `truncate` | Round towards Zero.                                                  |
| `banker`   | Round to the nearest even neighbor (Statistical rounding).           |

### Configuration Options

| Option         | Type           | Description                                      |
| :------------- | :------------- | :----------------------------------------------- |
| `precision`    | `number`       | Number of decimal places (default: `0`).         |
| `mode`         | `RoundingMode` | Rounding strategy (default: `'half'`).           |
| `prefix`       | `string`       | Text to prepend to the result.                   |
| `suffix`       | `string`       | Text to append to the result.                    |
| `isCompact`    | `boolean`      | If `true`, uses K/M/B/T suffixes.                |
| `isSmall`      | `boolean`      | If `true`, formats tiny numbers with subscripts. |
| `isScientific` | `boolean`      | If `true`, formats scientific notation           |

## License

ISC
