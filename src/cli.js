/**
 * migrator cli
 *
 * Migration cli usage:
 *
 * ```sh
 *  migrate
 *    [--schema -s schema name]
 *    [--file -f /path/to/api.json]
 *    [--dir /path/to/dir/]
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
import glob from 'glob'
import { log, fail, warn } from '@rabbitcc/logger'
import read from './reader'
import run, { defaultOptions } from '../lib/migrator'
import { version, description } from '../package.json'

/**
 * read stdio first
 */

getStdin().then(str => {
  let data
  if(str) {
    try {
      data = JSON.parse(str)
    } catch(e) {
      fail('[migrator.cli]', `Can't parse json`)
      throw new Error(fail('[migrator.cli]', e))
    }
  }

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
            describe: 'database schema name',
            default: process.env.PGRST_DB_SCHEMA || defaultOptions.schema,
            demandOption: true,
            type: 'string'
          },
          file: {
            alias: 'f',
            describe: 'read file from file',
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
        .showHelpOnFail(true, 'Specify --help for available options')
        .help()
        .version(version)
        .alias('v', 'version')
        .argv

  if(file) {
    const filePath = path.resolve(file)

    if(!fs.existsSync(filePath)) {
      throw new Error(fail(
        '[migrator.cli]',
        `no such file or direction at ${filePath}`
      ))
    }

    if(fs.statSync(filePath).isDirectory()) {
      /**
       * read directory files
       */
      const files = glob.sync(path.resolve(filePath, '*'))

      if(!files.length) {
        warn(
          '[migrator.cli]',
          `Can't find any files at directory: ${filePath}`
        )
      }

      data = files.reduce((acc, curr) => {
        const fileExt = path.extname(curr)
        const fileName = path.basename(curr, fileExt)
        acc[fileName] = read(curr)
      }, {})

    } else {
      /**
       * read file
       */
      data = read(filePath)
    }
  }

  /**
   * run
   */
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
