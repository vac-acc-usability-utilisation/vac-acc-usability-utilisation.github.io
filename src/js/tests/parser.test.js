// Basic test helpers - keep it simple
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
  };
}

// Import just what we need to test
import { getCurrentRoute } from '../router.js';

console.log('Testing route parser...');

// Test default route (empty hash)
test('empty hash returns default route', () => {
  window.location.hash = '';
  const route = getCurrentRoute();
  expect(route).toEqual({
    product: 'csa',
    mode: 'design',
    appArea: 'home',
    areaPage: null,
    pageTab: null,
    hasTabs: false,
  });
});

// Test full route 
test('parses complete route path', () => {
  history.replaceState(null, '', '#csa/demo/client/benefits/overview');
  const route = getCurrentRoute();
  expect(route).toEqual({
    product: 'csa',
    mode: 'demo', 
    appArea: 'client',
    areaPage: 'benefits',
    pageTab: 'overview',
    hasTabs: true,
  });
});

// Test partial route
test('handles partial routes', () => {
  history.replaceState(null, '', '#csa/demo/client');
  const route = getCurrentRoute();
  expect(route).toEqual({
    product: 'csa',
    mode: 'demo',
    appArea: 'client', 
    areaPage: null,
    pageTab: null,
    hasTabs: false,
  });
});

// Test route with empty segments
test('handles empty segments', () => {
  history.replaceState(null, '', '#csa//client//');
  const route = getCurrentRoute();
  expect(route).toEqual({
    product: 'csa',
    mode: 'design', // default
    appArea: 'client',
    areaPage: null,
    pageTab: null,
    hasTabs: false,
  });
});