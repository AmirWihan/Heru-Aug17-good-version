#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 HeruCRM Automated Test Suite');
console.log('================================\n');

const testSuites = [
  { name: 'Authentication Tests', command: 'npm run test:auth', file: 'auth.spec.ts' },
  { name: 'Super Admin Tests', command: 'npm run test:superadmin', file: 'superadmin.spec.ts' },
  { name: 'Lawyer Tests', command: 'npm run test:lawyer', file: 'lawyer.spec.ts' },
  { name: 'Client Tests', command: 'npm run test:client', file: 'client.spec.ts' },
  { name: 'Desktop App Tests', command: 'npm run test:desktop', file: 'desktop-app.spec.ts' }
];

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  suites: []
};

function runTestSuite(suite) {
  console.log(`\n🔍 Running ${suite.name}...`);
  
  try {
    const startTime = Date.now();
    execSync(suite.command, { stdio: 'pipe' });
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ ${suite.name} - PASSED (${duration}s)`);
    results.passed++;
    results.suites.push({ name: suite.name, status: 'PASSED', duration });
    
  } catch (error) {
    console.log(`❌ ${suite.name} - FAILED`);
    console.log(`   Error: ${error.message}`);
    results.failed++;
    results.suites.push({ name: suite.name, status: 'FAILED', error: error.message });
  }
  
  results.total++;
}

function generateReport() {
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`Total Test Suites: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Detailed Results:');
  results.suites.forEach(suite => {
    const status = suite.status === 'PASSED' ? '✅' : '❌';
    console.log(`${status} ${suite.name} - ${suite.status}${suite.duration ? ` (${suite.duration}s)` : ''}`);
    if (suite.error) {
      console.log(`   Error: ${suite.error}`);
    }
  });
  
  // Save results to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      successRate: ((results.passed / results.total) * 100).toFixed(1)
    },
    suites: results.suites
  };
  
  fs.writeFileSync('test-results/summary.json', JSON.stringify(reportData, null, 2));
  console.log('\n📄 Detailed report saved to: test-results/summary.json');
}

function checkPrerequisites() {
  console.log('🔧 Checking prerequisites...');
  
  // Check if test files exist
  testSuites.forEach(suite => {
    const filePath = path.join(__dirname, suite.file);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Test file not found: ${suite.file}`);
      process.exit(1);
    }
  });
  
  // Check if dev server is running
  try {
    execSync('curl -s http://localhost:9002 > /dev/null', { stdio: 'pipe' });
    console.log('✅ Development server is running on port 9002');
  } catch (error) {
    console.log('❌ Development server is not running on port 9002');
    console.log('   Please start the server with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ All prerequisites met\n');
}

function createTestResultsDir() {
  const testResultsDir = path.join(__dirname, '..', 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }
}

// Main execution
async function main() {
  try {
    createTestResultsDir();
    checkPrerequisites();
    
    console.log('🚀 Starting automated test suite...\n');
    
    // Run all test suites
    for (const suite of testSuites) {
      runTestSuite(suite);
    }
    
    generateReport();
    
    // Exit with appropriate code
    if (results.failed > 0) {
      console.log('\n❌ Some tests failed. Please review the results above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed! Your application is working correctly.');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('💥 Test runner error:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
HeruCRM Test Runner

Usage:
  node tests/run-tests.js [options]

Options:
  --help, -h     Show this help message
  --suite <name> Run a specific test suite (auth, superadmin, lawyer, client, desktop)
  --headed       Run tests in headed mode (show browser)
  --debug        Run tests in debug mode
  --report       Show test report after completion

Examples:
  node tests/run-tests.js                    # Run all tests
  node tests/run-tests.js --suite auth       # Run only authentication tests
  node tests/run-tests.js --headed           # Run all tests with visible browser
  node tests/run-tests.js --debug            # Run tests in debug mode
`);
  process.exit(0);
}

if (args.includes('--suite')) {
  const suiteIndex = args.indexOf('--suite');
  const suiteName = args[suiteIndex + 1];
  const suite = testSuites.find(s => s.name.toLowerCase().includes(suiteName.toLowerCase()));
  
  if (suite) {
    console.log(`🎯 Running specific test suite: ${suite.name}`);
    createTestResultsDir();
    checkPrerequisites();
    runTestSuite(suite);
    generateReport();
  } else {
    console.log(`❌ Test suite not found: ${suiteName}`);
    console.log('Available suites:', testSuites.map(s => s.name).join(', '));
    process.exit(1);
  }
} else {
  main();
} 