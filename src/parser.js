/**
 * Postgres connect string/object parser
 *
 * @flow
 */

import { parse as urlParse } from 'url'
import { twarn as warn, fail } from '@rabbitcc/logger'
import type { Connect, ConnectOptions } from './'

/**
 * connect default values, read from evn variable first
 *
 * @link https://www.postgresql.org/docs/10/static/libpq-envars.html
 * @link https://node-postgres.com/features/connecting#environment-variables
 */
const Default_Host = process.env.PGHOST || '127.0.0.1'
const Default_Port = process.env.PGPORT || '5432'
const Default_User = process.env.PGUSER || process.env.USER || 'postgres'
const Default_Pass = process.env.PGPASSWORD || null
const Default_DB   = process.env.PGDATABASE || process.env.USER || 'postgres'

export default function parse(connect: Connect): ConnectOptions {
  if(undefined === connect) {
    return parse({})
  }

  /**
   * parse raw string
   */
  if('string' === typeof connect) {
    try {
      const {
        protocol,
        auth,
        host,
        hostname,
        port,
        pathname
      } = urlParse(connect)

      if(!protocol || 'postgresql:' !== protocol) {
        throw new Error(
          `The protocol must be "postgresql:", but got ${String(protocol)}`
        )
      }

      /**
       * split username and password
       */
      const [user, pass] = auth ? auth.split(':') : ''

      /**
       * trim pathname
       */
      let data
      if(pathname && pathname.startsWith('/')) {
        data = pathname.substr(1)
      }

      return parse({
        host: hostname,
        port,
        user,
        pass,
        data
      })

    } catch(error) {
      fail('[migrator.parse]', 'Connect string parse failed')
      throw new Error(fail(error))
    }
  }

  const {
    host,
    port,
    user,
    pass,
    db,
    data,
    hostname,
    username,
    password,
    database
  } = connect

  const u = user || username || process.env.PGUSER || warn(
    '[migrator.parse]', `Use default username: ${Default_User}`
  )(Default_User)
  const p = pass || password || process.env.PGPASSWORD || warn(
    '[migrator.parse]', `Use no password`
  )(Default_Pass)
  const h = host || hostname || process.env.HOST || warn(
    '[migrator.parse]', `Use default host: ${Default_Host}`
  )(Default_Host)
  const o = port || process.env.PORT || warn(
    '[migrator.parse]', `Use default port: ${Default_Port}`
  )(Default_Port)
  const d = db || data || database || process.env.DATABASE || warn(
    '[migrator.parse]', `Use default databsse: ${Default_DB}`
  )(Default_DB)

  return {
    string: `postgresql://${p ? `${u}:${p}` : u}@${h}:${o}/${d}`,
    object: {
      user: u,
      pass: p,
      host: h,
      port: o,
      data: d
    }
  }
}
