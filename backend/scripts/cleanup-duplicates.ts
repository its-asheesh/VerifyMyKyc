#!/usr/bin/env node

/**
 * Cleanup script to remove JavaScript compilation artifacts
 * This script removes .js files that are duplicates of .ts files
 * while preserving functionality
 */

import fs from 'fs';
import path from 'path';

// Get the backend modules directory
// __dirname is provided by Node.js in CommonJS context
const modulesDir = path.join(__dirname, '..', 'src', 'modules');

/**
 * Recursively find all .js files that have corresponding .ts files
 */
function findDuplicateJsFiles(dir: string): string[] {
  const duplicates: string[] = [];

  function scanDirectory(currentDir: string) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and other non-source directories
        if (!item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        }
      } else if (item.endsWith('.js')) {
        // Check if corresponding .ts file exists
        const tsFile = fullPath.replace('.js', '.ts');
        if (fs.existsSync(tsFile)) {
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
function removeDuplicateFiles(files: string[]): void {
  console.log(`Found ${files.length} duplicate JavaScript files:`);

  for (const file of files) {
    try {
      fs.unlinkSync(file);
      console.log(`✓ Removed: ${file}`);
    } catch (error) {
      console.error(`✗ Failed to remove ${file}:`, error);
    }
  }
}

/**
 * Main cleanup function
 */
function cleanupDuplicates(): void {
  console.log('🧹 Starting cleanup of duplicate JavaScript files...');

  if (!fs.existsSync(modulesDir)) {
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

export { cleanupDuplicates, findDuplicateJsFiles };
