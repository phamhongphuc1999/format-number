import { compact, formatNumber, round } from '../src/index';

const samples = [
  '12345678987654321234567890.456789',
  '0.0000000000123',
  '999999999.995',
  '1e21',
  '1e-7',
  '1500000',
  '-12345.6789',
];

function bench(label: string, fn: () => void, iterations = 10000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) fn();
  const end = performance.now();
  // eslint-disable-next-line no-console
  console.log(`${label}: ${(end - start).toFixed(2)}ms (${iterations} iters)`);
}

bench('round', () => {
  for (const s of samples) round(s, { precision: 6 });
});

bench('round-fixed', () => {
  for (const s of samples) round(s, { precision: 6, fixed: true });
});

bench('compact', () => {
  for (const s of samples) compact(s, { precision: 2 });
});

bench('formatNumber', () => {
  for (const s of samples)
    formatNumber(s, { precision: 2, isCompact: true, notation: 'scientific', fixed: true });
});
