# Handling Non-Number Inputs

In a JavaScript/TypeScript library, handling non-number inputs (like invalid strings, `null`, `undefined`, or `NaN`) is critical for preventing runtime crashes and ensuring a predictable user experience.

## Why Handle Non-Number Inputs?

1.  **Robustness**: Prevents your application from breaking when unexpected data is received from APIs or user input.
2.  **Predictability**: Provides a consistent visual output (like `0` or `--`) instead of `NaN` or `undefined`.
3.  **Developer Experience**: Helps developers debug data issues without deep-diving into library internals.

## Current Strategy: Fallback Messaging

The library employs a **Fallback Strategy** in the `parseNum` utility. Instead of throwing an error, it returns a safe placeholder string.

### 1. Default Fallback
If the input cannot be parsed as a valid number, the library returns `--` by default.

```typescript
import { parseNum } from '@peter-present/format-number';

parseNum('invalid_string'); // Returns '--'
```

### 2. Custom Fallback
You can customize what is returned when parsing fails by passing a `fallback` option.

```typescript
parseNum('invalid_string', { fallback: '0' }); // Returns '0'
parseNum('unknown', { fallback: 'N/A' });    // Returns 'N/A'
```

## Recommended Best Practices

### Use Type Safety (TypeScript)
The library defines `NumberType` as `number | string | bigint`. This encourages developers to pass data that *should* be numeric. However, TypeScript cannot catch invalid string contents (like `'abc'`) at compile time.

### Validate Data Early
Whenever possible, validate your data before passing it to the formatting library. If you expect a number, use a schema validator (like Zod) or simple check:

```typescript
const value = apiResponse.price;
if (!value) {
  // Handle empty state before formatting
}
```

### Choose Fallbacks Wisely
- Use `0` if you want to perform further calculations or if `0` is a valid "empty" state.
- Use `--` or `N/A` for UI displays to indicate that the data is missing or corrupted.

## Future Improvements

We are considering implementing a **Strict Mode** that can be toggled via global configuration or local options, which would throw a descriptive error when invalid input is encountered. This would be useful during development to catch data issues early.
