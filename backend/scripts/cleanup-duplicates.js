#!/usr/bin/env node
'use strict';
/**
 * Cleanup script to remove JavaScript compilation artifacts
 * This script removes .js files that are duplicates of .ts files
 * while preserving functionality
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.cleanupDuplicates = cleanupDuplicates;
exports.findDuplicateJsFiles = findDuplicateJsFiles;
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
// Get the backend modules directory
// __dirname is provided by Node.js in CommonJS context
const modulesDir = path_1.default.join(__dirname, '..', 'src', 'modules');
/**
 * Recursively find all .js files that have corresponding .ts files
 */
function findDuplicateJsFiles(dir) {
  const duplicates = [];
  function scanDirectory(currentDir) {
    const items = fs_1.default.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path_1.default.join(currentDir, item);
      const stat = fs_1.default.statSync(fullPath);
      if (stat.isDirectory()) {
        // Skip node_modules and other non-source directories
        if (!item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        }
      } else if (item.endsWith('.js')) {
        // Check if corresponding .ts file exists
        const tsFile = fullPath.replace('.js', '.ts');
        if (fs_1.default.existsSync(tsFile)) {
          duplicates.push(fullPath);
        }
      }
    }
  }
  scanDirectory(dir);
  return duplicates;
}
/**
 * Remove duplicate JavaScript files
 */
function removeDuplicateFiles(files) {
  console.log(`Found ${files.length} duplicate JavaScript files:`);
  for (const file of files) {
    try {
      fs_1.default.unlinkSync(file);
      console.log(`✓ Removed: ${file}`);
    } catch (error) {
      console.error(`✗ Failed to remove ${file}:`, error);
    }
  }
}
/**
 * Main cleanup function
 */
function cleanupDuplicates() {
  console.log('🧹 Starting cleanup of duplicate JavaScript files...');
  if (!fs_1.default.existsSync(modulesDir)) {
    console.error('❌ Modules directory not found:', modulesDir);
    process.exit(1);
  }
  const duplicateFiles = findDuplicateJsFiles(modulesDir);
  if (duplicateFiles.length === 0) {
    console.log('✅ No duplicate JavaScript files found.');
    return;
  }
  console.log('\nDuplicate files found:');
  duplicateFiles.forEach((file) => console.log(`  - ${file}`));
  console.log('\n⚠️  WARNING: This will permanently delete the above JavaScript files.');
  console.log('Make sure you have a backup and that these are compilation artifacts.');
  // In a real implementation, you might want to add a confirmation prompt
  // For now, we'll just log what would be removed
  console.log('\n🔍 Analysis complete. To actually remove files, uncomment the line below:');
  console.log('// removeDuplicateFiles(duplicateFiles);');
  // Uncomment the line below to actually remove the files
  // removeDuplicateFiles(duplicateFiles);
}
// Run cleanup if this script is executed directly (CommonJS check)
if (typeof require !== 'undefined' && require.main === module) {
  cleanupDuplicates();
}
