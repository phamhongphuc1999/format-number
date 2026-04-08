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

const now =
  typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? () => performance.now()
    : () => {
        const hr = (globalThis as { process?: { hrtime?: { bigint?: () => bigint } } }).process
          ?.hrtime?.bigint;
        return hr ? Number(hr()) / 1e6 : Date.now();
      };

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const iterations = Number(env?.BENCH_ITERS ?? '20000');
const warmupIterations = Number(env?.BENCH_WARMUP ?? '2000');

let sink = 0;

function bench(label: string, fn: () => number) {
  for (let i = 0; i < warmupIterations; i += 1) sink ^= fn();

  const start = now();
  for (let i = 0; i < iterations; i += 1) sink ^= fn();
  const end = now();

  const totalOps = iterations * samples.length;
  const ms = end - start;
  const opsPerSec = (totalOps / ms) * 1000;
  // eslint-disable-next-line no-console
  console.log(`${label}: ${ms.toFixed(2)}ms | ${opsPerSec.toFixed(0)} ops/s | ${totalOps} ops`);
}

bench('round', () => {
  let acc = 0;
  for (const s of samples) acc += round(s, { precision: 6 }).length;
  return acc;
});

bench('round-fixed', () => {
  let acc = 0;
  for (const s of samples) acc += round(s, { precision: 6, fixed: true }).length;
  return acc;
});

bench('compact', () => {
  let acc = 0;
  for (const s of samples) acc += compact(s, { precision: 2 }).length;
  return acc;
});

bench('formatNumber', () => {
  let acc = 0;
  for (const s of samples)
    acc += formatNumber(s, {
      precision: 2,
      isCompact: true,
      notation: 'scientific',
      fixed: true,
    }).length;
  return acc;
});

// Prevent the accumulator from being optimized away in some runtimes.
// eslint-disable-next-line no-console
console.log('sink', sink === 0 ? '' : '');
