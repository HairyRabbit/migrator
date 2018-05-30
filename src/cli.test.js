/**
 * @jest
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

test('should starts with shebang', () => {
  execSync('npm run build')
  const content = fs.readFileSync(path.resolve('bin/cli.js'), 'utf-8')
  expect(
    content.startsWith('#!/usr/bin/env node')
  ).toEqual(
    true
  )
})
