# format-number

A lightweight, zero-dependency JavaScript/TypeScript library for precise number formatting. Designed for financial applications, crypto dashboards, and scientific data where precision is paramount.

Unlike standard libraries that rely on floating-point math, **format-number** uses internal string-based arithmetic to handle numbers of any size (including `string`, `number`, and `bigint`) without losing a single decimal point.

For detailed documentation, visit: [here](https://blog.peter-present.xyz/format-number)

## Key Features

- **Zero Precision Loss**: Uses string manipulation for rounding and formatting to avoid binary floating-point errors.
- **Robust Input Parsing**: Handles messy strings with currency symbols ($€£¥), commas, underscores, and scientific notation automatically.
- **Advanced Rounding**: 5 strategies (`half`, `up`, `down`, `banker`, `truncate`) with customizable decimal precision.
- **Intelligent Notation**: Format small numbers with subscript zeros (e.g., `0.0₃5`) or standard scientific notation.
- **Flexible Compacting**: Shorten massive numbers into readable strings like `1.5T` or `20.4B`.
- **Fluent Chainable API**: Build complex formatting logic with a clean, readable syntax.

## Installation

```shell
# npm
npm install @peter-present/format-number

# yarn
yarn add @peter-present/format-number

# bun
bun install @peter-present/format-number
```

## Core API

### `formatNumber(value, options)`

The primary entry point for one-off formatting. It combines parsing, rounding, and visualization.

```typescript
import { formatNumber } from '@peter-present/format-number';

// Currency & Rounding
formatNumber('$1,234.567', { prefix: '€', precision: 2 }); // '€1234.57'

// Compact Notation
formatNumber(1500000000, { isCompact: true }); // '1.5B'

// Special Notations
formatNumber(0.00005, { notation: 'subscript' }); // '0.0₄5'
formatNumber(12345, { notation: 'scientific' }); // '1.2345e+4'
```

### `FN(value)` - Fluent API

Best for complex, multi-step formatting requirements where readability is key.

```typescript
import { FN } from '@peter-present/format-number';

const formatted = FN('1234567.89')
  .round({ precision: 0, rounding: 'banker' })
  .prefix('Balance: ')
  .suffix(' USD')
  .toNumber();

console.log(formatted); // 'Balance: 1234568 USD'

// Seamlessly combine with compact and notation
FN(1500).compact({ precision: 1 }).prefix('$').toNumber(); // '$1.5K'
```

### `round(value, options)`

Independent rounding utility with high-precision string logic.

```typescript
import { round } from '@peter-present/format-number';

round(1.235, { precision: 2, rounding: 'half' }); // '1.24'
round(1.235, { precision: 2, rounding: 'down' }); // '1.23'
```

## Configuration Reference

### `RoundingMode`

| Mode       | Description                                                            |
| :--------- | :--------------------------------------------------------------------- |
| `half`     | Rounds to the nearest neighbor (rounds away from zero if equidistant). |
| `up`       | Rounds towards Positive Infinity.                                      |
| `down`     | Rounds towards Negative Infinity.                                      |
| `truncate` | Rounds towards Zero (trims decimals).                                  |
| `banker`   | Rounds to the nearest even neighbor (minimizes statistical bias).      |

### `FormattingConfigType`

| Property    | Type                          | Default     | Description                                        |
| :---------- | :---------------------------- | :---------- | :------------------------------------------------- |
| `precision` | `number`                      | `0`         | Number of decimal places to maintain.              |
| `rounding`  | `RoundingMode`                | `'half'`    | Strategy used for rounding.                        |
| `prefix`    | `string`                      | `""`        | Text prepended to the result.                      |
| `suffix`    | `string`                      | `""`        | Text appended to the result.                       |
| `isCompact` | `boolean`                     | `false`     | Whether to use K/M/B/T suffixes for large numbers. |
| `notation`  | `'subscript' \| 'scientific'` | `undefined` | Special formatting for extreme values.             |

## License

ISC
