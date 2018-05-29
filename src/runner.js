/**
 * SQL runner
 *
 * @flow
 */

import { Client } from 'pg'
import { log, fail, tdone as done } from '@rabbitcc/logger'
import type { Options } from './'

export default function exec(options: Options): void {
  const { connobj: connect, sql } = options

  if(!connect) {
    throw new Error(fail('[migrate]Unparsed connect object'))
  }
  /**
   * connect postgres server
   */
  const password = connect.object.pass
        ? '*'.repeat(connect.object.pass.length)
        : 'NO'
  log(
    '[migrator.connect]Database connecting...\n\n' +
      '  Username:\t' + connect.object.user + '\n' +
      '  Password:\t' + password + '\n' +
      '  Server host:\t' + connect.object.host + '\n' +
      '  Server port:\t' + connect.object.port + '\n' +
      '  Database:\t' + connect.object.data + '\n'
  )

  const client = new Client({
    connectionString: connect.string
  })

  client.connect()
    .then(() => {
      log('[migrator.query]Ready to exec SQL:', '\n', sql)

      /**
       * query sql
       */
      client.query(sql)
        .then(done('[migrator.query]Migration exec successful'))
        .catch(err => {
          fail('[migrator.query]Migration exec failed')
          throw new Error(err)
        })
        .catch(fail)
        .then(() => client.end())
    })
    .catch(err => {
      fail(`[migrator.connect]Database connect failed`)
      throw new Error(err)
    })
    .catch(fail)
}
