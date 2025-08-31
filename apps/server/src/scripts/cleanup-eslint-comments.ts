#!/usr/bin/env bun

/**
 * ESLint Comments Cleanup Script
 *
 * This script removes unnecessary eslint-disable comments since we use Biome, not ESLint.
 * Used by: Code maintenance and cleanup
 * Purpose: Removes obsolete eslint-disable-next-line comments from TypeScript files
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

async function main() {
  try {
    console.log('🧹 Cleaning up ESLint disable comments...')

    const srcDir = join(process.cwd(), 'src')
    const files = await findTypeScriptFiles(srcDir)

    let totalFiles = 0
    let totalLinesRemoved = 0

    for (const file of files) {
      const result = await cleanupFile(file)
      if (result.linesRemoved > 0) {
        totalFiles++
        totalLinesRemoved += result.linesRemoved
        console.log(
          `   ✅ ${file}: removed ${result.linesRemoved} eslint comments`
        )
      }
    }

    console.log('\n🎉 Cleanup completed!')
    console.log(`   - Files processed: ${files.length}`)
    console.log(`   - Files modified: ${totalFiles}`)
    console.log(`   - Total lines removed: ${totalLinesRemoved}`)

    process.exit(0)
  } catch (error) {
    console.error('💥 Cleanup failed:', error)
    process.exit(1)
  }
}

/**
 * Find all TypeScript files recursively
 * Used by: main() to get list of files to process
 * Purpose: Discovers all .ts files in the source directory
 */
async function findTypeScriptFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

/**
 * Clean up ESLint comments from a single file
 * Used by: main() to process individual files
 * Purpose: Removes eslint-disable comments and returns count of changes
 */
async function cleanupFile(
  filePath: string
): Promise<{ linesRemoved: number }> {
  const content = await readFile(filePath, 'utf-8')
  const lines = content.split('\n')
  const originalLineCount = lines.length

  // Remove lines that are only eslint-disable comments
  const cleanedLines = lines.filter((line) => {
    const trimmed = line.trim()
    return !(
      trimmed.startsWith('// eslint-disable-next-line') ||
      trimmed.startsWith('/* eslint-disable-next-line') ||
      trimmed === '// eslint-disable' ||
      trimmed === '/* eslint-disable */'
    )
  })

  const linesRemoved = originalLineCount - cleanedLines.length

  if (linesRemoved > 0) {
    const newContent = cleanedLines.join('\n')
    await writeFile(filePath, newContent, 'utf-8')
  }

  return { linesRemoved }
}

// Run the script
main()
