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
  };
}

// We need to export resolvePath from loadPage.js for testing
// For now, we'll test the logic inline
function resolvePath(segments) {
  if (!Array.isArray(segments)) {
    segments = [segments];
  }
  if (segments.length === 1) {
    return `src/pages/${segments[0]}/home.html`;
  }
  const basePathSegments = segments.slice(0, 4);
  return `src/pages/${basePathSegments.join('/')}.html`;
}

console.log('Testing resolvePath...');

// Test single segment
test('single segment creates home path', () => {
  const result = resolvePath(['csa']);
  expect(result).toBe('src/pages/csa/home.html');
});

// Test single string (not array)
test('single string converts to array and creates home path', () => {
  const result = resolvePath('csa');
  expect(result).toBe('src/pages/csa/home.html');
});

// Test two segments
test('two segments creates joined path', () => {
  const result = resolvePath(['csa', 'design']);
  expect(result).toBe('src/pages/csa/design.html');
});

// Test three segments
test('three segments creates joined path', () => {
  const result = resolvePath(['csa', 'design', 'components']);
  expect(result).toBe('src/pages/csa/design/components.html');
});

// Test four segments (max used for path)
test('four segments creates full path', () => {
  const result = resolvePath(['csa', 'design', 'components', 'buttons']);
  expect(result).toBe('src/pages/csa/design/components/buttons.html');
});

// Test more than four segments (only first 4 used)
test('more than four segments only uses first four', () => {
  const result = resolvePath(['csa', 'design', 'components', 'buttons', 'overview', 'extra']);
  expect(result).toBe('src/pages/csa/design/components/buttons.html');
});

// Test empty array
test('empty array creates empty path', () => {
  const result = resolvePath([]);
  expect(result).toBe('src/pages/.html');
});
