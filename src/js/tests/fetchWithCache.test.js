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

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toEqual(expected) {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
      }
    },
    toBeGreaterThan(expected) {
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toContain(expected) {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    },
  };
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log('✅', name);
  } catch (err) {
    console.error('❌', name);
    console.error(err);
  }
}

console.log('Testing fetchWithCache...');

// Mock fetch for testing
const originalFetch = window.fetch;
let fetchCallCount = 0;
let mockResponse = 'test data';

window.fetch = async (url) => {
  fetchCallCount++;
  return {
    ok: true,
    text: async () => mockResponse,
    json: async () => JSON.parse(mockResponse),
  };
};

// Simple in-memory cache
const fetchCache = new Map();

async function fetchWithCache(url, options = {}) {
  const { forceRefresh = false } = options;

  if (!forceRefresh && fetchCache.has(url)) {
    return fetchCache.get(url);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  fetchCache.set(url, text);
  return text;
}

// Test 1: Basic fetch
await asyncTest('fetches data on first call', async () => {
  fetchCallCount = 0;
  fetchCache.clear();
  mockResponse = 'first call data';

  const result = await fetchWithCache('test-url-1');
  expect(result).toBe('first call data');
  expect(fetchCallCount).toBe(1);
});

// Test 2: Cache hit
await asyncTest('returns cached data on second call', async () => {
  fetchCallCount = 0;
  fetchCache.clear();
  mockResponse = 'cached data';

  await fetchWithCache('test-url-2');
  const firstCallCount = fetchCallCount;

  const result = await fetchWithCache('test-url-2');
  expect(result).toBe('cached data');
  expect(fetchCallCount).toBe(firstCallCount); // Should not increment
});

// Test 3: Force refresh
await asyncTest('bypasses cache when forceRefresh is true', async () => {
  fetchCallCount = 0;
  fetchCache.clear();
  mockResponse = 'initial data';

  await fetchWithCache('test-url-3');
  const firstCallCount = fetchCallCount;

  mockResponse = 'refreshed data';
  const result = await fetchWithCache('test-url-3', { forceRefresh: true });
  expect(result).toBe('refreshed data');
  expect(fetchCallCount).toBeGreaterThan(firstCallCount);
});

// Test 4: Different URLs have separate cache entries
await asyncTest('different URLs have separate cache entries', async () => {
  fetchCache.clear();
  mockResponse = 'url-a data';
  const resultA = await fetchWithCache('test-url-a');

  mockResponse = 'url-b data';
  const resultB = await fetchWithCache('test-url-b');

  expect(resultA).toBe('url-a data');
  expect(resultB).toBe('url-b data');
  expect(fetchCache.size).toBe(2);
});

// Test 5: Error handling
await asyncTest('throws error on failed fetch', async () => {
  window.fetch = async () => ({
    ok: false,
    status: 404,
    text: async () => 'Not Found',
  });

  try {
    await fetchWithCache('test-url-error');
    throw new Error('Should have thrown an error');
  } catch (err) {
    expect(err.message).toContain('HTTP error');
  }
});

// Restore original fetch
window.fetch = originalFetch;

console.log('All fetchWithCache tests complete!');
