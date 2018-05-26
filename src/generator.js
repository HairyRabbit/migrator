/**
 * SQL generator
 *
 * @flow
 */

import mapType from './type-mapper'
import type { Options } from './'

export default function generate(options: Options): Options {
  const {
    data = {},
    schema = 'api',
    id = true,
    timestamp = true,
    operator = false,
    softDelete = true
  } = options || {}

  const tables = []
  const types = []
  const comments = []
  /**
   * @TODO: references supports
   */
  const references = []

  for(let table in data) {
    const item = data[table]

    /**
     * the table type must be object
     */
    if('object' !== item.type) {
      throw new Error(
        'schema type must be "object", but got ' + item.type
      )
    }

    /**
     * add table comments from description
     */
    item.description && comments.push({
      type: 'table',
      target: `${schema}.${table}`,
      content: item.description
    })

    /**
     * begin collect columns
     */
    let collects = []

    const columns = item.properties

    const {
      id: tid,
      timestamp: ttimestamp,
      operator: toperator,
      softDelete: tsoftDelete,
      primaryKey: tprimaryKey,
      dataType,
      check
    } = table.additionalProperties || {}

    /**
     * add id column for primary key first
     */
    ;(id || tid) && genIdColumn(collects)

    for(let column in columns) {
      const col = columns[column]

      /**
       * map json type to data type, if not provide additionalProperties.dataType
       */
      const type = dataType || mapType(col, { schema, table, column })

      /**
       * add types
       */
      col.enum && types.push({
        name: `${schema}.${table}_${column}`,
        enums: col.enum
      })

      /**
       * add column comments from description
       */
      col.description && comments.push({
        type: 'column',
        target: `${schema}.${table}.${column}`,
        content: col.description
      })

      collects.push({
        name: column,
        type,
        nullable: col.nullable,
        primaryKey: tprimaryKey,
        default: col.default,
        check
      })
    }

    /**
     * add other additional columns
     */
    ;(timestamp || ttimestamp) && genTimestampColumn(collects)
    ;(operator || toperator) && genOperatorColumn(collects)
    ;(softDelete || tsoftDelete) && genSoftDeleteColumn(collects)

    /**
     * add tables
     */
    tables.push({
      name: `${schema}.${table}`,
      columns: collects,
    })

    /**
     * collect done, reset list
     */
    collects = []
  }

  return {
    ...options,
    metas: {
      tables,
      types,
      comments
    }
  }
}

function genIdColumn(arr: Array<*>): void {
  arr.push({
    name: 'id',
    type: 'serial',
    primaryKey: true
  })
}

function genTimestampColumn(arr: Array<*>): void {
  ['create_at', 'update_at'].forEach(name => {
    arr.push({
      name,
      type: 'timestamp',
      nullable: false,
      default: 'CURRENT_TIMESTAMP'
    })
  })
}

function genOperatorColumn(arr: Array<*>): void {
  ['create_by', 'update_by'].forEach(name => {
    arr.push({
      name,
      type: 'integer',
      nullable: true,
      default: '-1'
    })
  })
}

function genSoftDeleteColumn(arr: Array<*>): void {
  arr.push({
    name: 'delete_at',
    type: 'timestamp',
    nullable: true
  })
}
