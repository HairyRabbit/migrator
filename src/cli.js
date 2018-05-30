/**
 * migrator cli
 *
 * Migration cli usage:
 *
 * ```sh
 *  migrate
 *    [--schema -s schema name]
 *    [--file -f /path/to/api.json]
 *    [--connect connect |
 *     --username -u username
 *     --password -P password
 *     --host -h hostname
 *     --port -p port
 *     --database -d database]
 * ```
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import getStdin from 'get-stdin'
import { log, fail } from '@rabbitcc/logger'
import run from '../lib/migrator'
import { version } from '../package.json'

const {
  schema,
  file,
  connect,
  username,
  password,
  hostname,
  port,
  database
} = yargs
      .usage('Usage: migrate [options]')
      .options({
        schema: {
          alias: 's',
          describe: 'schema name',
          demandOption: true,
          type: 'string'
        },
        file: {
          alias: 'f',
          describe: 'api json file path',
          type: 'string'
        },
        connect: {
          alias: 'c',
          describe: 'database server connect string',
          type: 'string'
        },
        username: {
          alias: 'u',
          describe: 'database connect username',
          type: 'string'
        },
        password: {
          alias: 'P',
          describe: 'database connect password',
          type: 'string'
        },
        hostname: {
          alias: 'h',
          describe: 'database connect hostname',
          type: 'string'
        },
        port: {
          alias: 'p',
          describe: 'database connect port',
          type: 'string'
        },
        database: {
          alias: 'd',
          describe: 'database connect database',
          type: 'string'
        }
      })
      .help()
      .alias('h', 'help')
      .version(version)
      .alias('v', 'version')
      .argv

/**
 * read file content or stdin
 */
let promise
if(file) {
  try {
    const filePath = path.resolve(file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    promise = Promise.resolve(JSON.parse(fileContent))
  } catch(e) {
    fail('[Migrator.readfile]', `Can't parse json`)
    throw new Error(e)
  }
} else {
  promise = getStdin().then(str => {
    try {
      return JSON.parse(str)
    } catch(e) {
      fail('[Migrator.readfile]', `Can't parse json`)
      throw new Error(e)
    }
  })
}

/**
 * run
 */
export default promise.then(data => {
  run({
    schema,
    data,
    connect: connect || {
      host: hostname,
      port: port,
      user: username,
      pass: password,
      data: database
    }
  })
}).catch(fail)
