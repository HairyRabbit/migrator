/**
 * File content reader
 *
 * supports file type:
 *  - yaml - use 'js-yaml' lib
 *  - json - use JSON.parse
 *  - js   - use require
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import { fail } from '@rabbitcc/logger'

export default function read(filePath: string): string {
  const fileExt = path.extname(filePath)
  const fileType = fileExt.startsWith('.')
        ? fileExt.substr(1)
        : fileExt

  /**
   * read file content by supported loaders
   */
  try {
    switch(fileType) {
      case 'yaml':
        return require('js-yaml').load(fs.readFileSync(filePath, 'utf-8'))
      case 'json':
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      case 'js':
        // $FlowFixMe
        const mod = __non_webpack_require__(filePath)
        delete __non_webpack_require__.cache[filePath]
        return mod.default || mod
      default:
        throw new Error(
          `Unknow file type: ${fileType}`
        )
    }
  } catch(e) {
    throw new Error(fail('[migrator.reader]', e))
  }
}
