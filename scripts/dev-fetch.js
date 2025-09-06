#!/usr/bin/env node

// This is a development script to fetch officers data
// Run with: npm run fetch-data

const { execSync } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'fetch-officers.js');

try {
  console.log('🔄 Fetching officers data...');
  execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  console.log('✅ Officers data fetched successfully!');
} catch (error) {
  console.error('❌ Failed to fetch officers data:', error.message);
  process.exit(1);
}
