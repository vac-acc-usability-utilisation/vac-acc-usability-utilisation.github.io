const { chromium } = require('playwright');
const { resolve } = require('path');
const { createServer } = require('http');
const { readFileSync } = require('fs');

const rootDir = resolve(__dirname, '../../..');

// Simple static file server
function createTestServer(port = 3000) {
  const server = createServer((req, res) => {
    try {
      const filePath = resolve(rootDir, req.url.slice(1) || 'index.html');
      const content = readFileSync(filePath);
      
      // Set content type based on extension
      const ext = filePath.split('.').pop();
      const contentTypes = {
        'html': 'text/html',
        'js': 'application/javascript',
        'json': 'application/json',
        'css': 'text/css'
      };
      
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  return new Promise((resolvePromise) => {
    server.listen(port, () => {
      console.log(`Test server running at http://localhost:${port}`);
      resolvePromise({ server, port });
    });
  });
}

async function runTests() {
  console.log('🧪 Starting test suite...\n');
  
  // Start test server
  const { server, port } = await createTestServer();
  
  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track test results
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  // Capture console messages
  page.on('console', (msg) => {
    const text = msg.text();
    
    if (text.startsWith('✅')) {
      passedTests++;
      totalTests++;
      console.log(text);
    } else if (text.startsWith('❌')) {
      failedTests++;
      totalTests++;
      console.error(text);
    } else if (text.includes('Testing') || text.includes('tests')) {
      console.log(text);
    }
  });
  
  // Run each test file
  const testFiles = [
    'src/js/tests/parser.html',
    'src/js/tests/resolvePath.html',
    'src/js/tests/fetchWithCache.html',
    'src/js/tests/perfFlag.html'
  ];
  
  for (const testFile of testFiles) {
    console.log(`\n📝 Running ${testFile}...`);
    await page.goto(`http://localhost:${port}/${testFile}`);
    
    // Wait for tests to complete (give them time to run)
    await page.waitForTimeout(2000);
  }
  
  // Print summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Test Summary');
  console.log('═'.repeat(50));
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ✅ ${passedTests}`);
  console.log(`Failed: ❌ ${failedTests}`);
  console.log('═'.repeat(50));
  
  // Cleanup
  await browser.close();
  server.close();
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Error running tests:', err);
  process.exit(1);
});
