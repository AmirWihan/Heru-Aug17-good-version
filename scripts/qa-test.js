#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Comprehensive QA Test...\n');

// Test categories
const testResults = {
  build: { passed: 0, failed: 0, tests: [] },
  dependencies: { passed: 0, failed: 0, tests: [] },
  files: { passed: 0, failed: 0, tests: [] },
  desktop: { passed: 0, failed: 0, tests: [] },
  security: { passed: 0, failed: 0, tests: [] }
};

function addTest(category, testName, passed, details = '') {
  const result = { name: testName, passed, details };
  testResults[category].tests.push(result);
  if (passed) {
    testResults[category].passed++;
  } else {
    testResults[category].failed++;
  }
}

// 1. Build Tests
console.log('🏗️  Testing Build Process...');
try {
  // Check if build command works
  execSync('npm run build', { stdio: 'pipe' });
  addTest('build', 'Next.js Build', true, 'Application builds successfully');
} catch (error) {
  addTest('build', 'Next.js Build', false, error.message);
}

// 2. Dependency Tests
console.log('📦 Testing Dependencies...');

// Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Required dependencies
  const requiredDeps = [
    'next', 'react', 'react-dom', 'typescript',
    'electron', 'electron-builder', 'firebase'
  ];
  
  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    addTest('dependencies', `${dep} dependency`, !!hasDep, hasDep ? `Version: ${packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]}` : 'Missing');
  });
  
  // Check scripts
  const requiredScripts = ['dev', 'build', 'start', 'electron-dev', 'electron-pack'];
  requiredScripts.forEach(script => {
    const hasScript = !!packageJson.scripts?.[script];
    addTest('dependencies', `${script} script`, hasScript, hasScript ? 'Available' : 'Missing');
  });
  
} catch (error) {
  addTest('dependencies', 'Package.json parsing', false, error.message);
}

// 3. File Structure Tests
console.log('📁 Testing File Structure...');

const requiredFiles = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/login/page.tsx',
  'src/app/lawyer/dashboard/page.tsx',
  'src/app/client/dashboard/page.tsx',
  'src/app/superadmin/dashboard/page.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/context/GlobalDataContext.tsx',
  'src/lib/firebase.ts',
  'electron/main.js',
  'electron/preload.js',
  'next.config.ts',
  'tailwind.config.ts',
  'tsconfig.json'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  addTest('files', `${file} exists`, exists, exists ? 'Found' : 'Missing');
});

// 4. Desktop App Tests
console.log('🖥️  Testing Desktop App Setup...');

const desktopFiles = [
  'electron/main.js',
  'electron/preload.js',
  'electron/assets/icon.png'
];

desktopFiles.forEach(file => {
  const exists = fs.existsSync(file);
  addTest('desktop', `${file} exists`, exists, exists ? 'Found' : 'Missing');
});

// Check electron configuration
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasMain = !!packageJson.main;
  const hasBuild = !!packageJson.build;
  
  addTest('desktop', 'Electron main entry', hasMain, hasMain ? packageJson.main : 'Missing');
  addTest('desktop', 'Electron build config', hasBuild, hasBuild ? 'Configured' : 'Missing');
} catch (error) {
  addTest('desktop', 'Electron config parsing', false, error.message);
}

// 5. Security Tests
console.log('🔒 Testing Security Configuration...');

// Check for environment variables
const envFile = '.env.local';
const hasEnvFile = fs.existsSync(envFile);
addTest('security', 'Environment file', hasEnvFile, hasEnvFile ? 'Found' : 'Missing - create .env.local');

// Check TypeScript config
try {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  const hasStrict = tsConfig.compilerOptions?.strict;
  addTest('security', 'TypeScript strict mode', !!hasStrict, hasStrict ? 'Enabled' : 'Disabled');
} catch (error) {
  addTest('security', 'TypeScript config', false, error.message);
}

// Check for sensitive files
const sensitiveFiles = ['.env', '.env.production', 'firebase-key.json'];
sensitiveFiles.forEach(file => {
  const exists = fs.existsSync(file);
  addTest('security', `${file} not in repo`, !exists, exists ? 'WARNING: Sensitive file found' : 'Good - not in repo');
});

// Print Results
console.log('\n📊 QA Test Results:\n');

Object.entries(testResults).forEach(([category, results]) => {
  console.log(`${category.toUpperCase()}:`);
  console.log(`  Passed: ${results.passed}, Failed: ${results.failed}`);
  
  results.tests.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    console.log(`  ${status} ${test.name}: ${test.details}`);
  });
  console.log('');
});

// Summary
const totalPassed = Object.values(testResults).reduce((sum, cat) => sum + cat.passed, 0);
const totalFailed = Object.values(testResults).reduce((sum, cat) => sum + cat.failed, 0);
const totalTests = totalPassed + totalFailed;

console.log('🎯 SUMMARY:');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${totalPassed}`);
console.log(`Failed: ${totalFailed}`);
console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);

if (totalFailed === 0) {
  console.log('\n🎉 All tests passed! The application is ready for deployment.');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues before deployment.');
}

console.log('\n📋 Next Steps:');
console.log('1. Fix any failed tests above');
console.log('2. Run "npm run dev" to test the application locally');
console.log('3. Run "npm run electron-dev" to test the desktop app');
console.log('4. Follow the deployment guide in README.md'); 