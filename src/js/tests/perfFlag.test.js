// Basic test helpers
function test(name, fn) {
  try {
    fn();
    console.log('✅', name);
  } catch (err) {
    console.error('❌', name);
    console.error(err);
  }
}

import {
  enablePerformanceLogging,
  disablePerformanceLogging,
  isPerformanceLoggingEnabled,
  perfStart,
  perfEnd,
} from '../utils.js';

console.log('Testing performance logging utils...');

test('disable by default', () => {
  try { localStorage.removeItem('perfLog'); } catch (_) {}
  if (isPerformanceLoggingEnabled()) {
    throw new Error('perf logging should be disabled by default');
  }
});

test('enablePerformanceLogging sets the flag', () => {
  enablePerformanceLogging();
  if (!isPerformanceLoggingEnabled()) {
    throw new Error('perf logging should be enabled after calling enablePerformanceLogging');
  }
});

test('disablePerformanceLogging removes the flag', () => {
  enablePerformanceLogging();
  disablePerformanceLogging();
  if (isPerformanceLoggingEnabled()) {
    throw new Error('perf logging should be disabled after calling disablePerformanceLogging');
  }
});

// perfStart/perfEnd should return a number and not throw

test('perfStart/perfEnd basic timing returns a number', () => {
  const mark = perfStart('unit-test');
  // do a tiny busy wait to ensure measurable time
  const end = Date.now() + 1; // ~1ms
  while (Date.now() < end) {}
  const ms = perfEnd(mark);
  if (typeof ms !== 'number' || Number.isNaN(ms)) {
    throw new Error('perfEnd should return a numeric duration');
  }
});

console.log('All perf logging tests complete!');
