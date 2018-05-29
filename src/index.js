/**
 * Migration
 *
 * @flow
 */

import { tfail as fail } from '@rabbitcc/logger'
import check from './checker'
import parse from './parser'
import generate from './generator'
import render from './render'
import exec from './runner'

type SQLExpr = string
type DataType = string

export type Column = {
  name: string,
  type: DataType,
  primaryKey?: boolean,
  nullable?: boolean,
  unique?: boolean,
  default?: string | number | boolean,
  check?: ?SQLExpr
}

export type Connect =
  | string
  | {
    host?: string,
    port?: string,
    user?: string,
    pass?: string,
    db?: string,
    data?: string,
    hostname?: string,
    username?: string,
    password?: string,
    database?: string
  }

export type ConnectOptions = {
  string: string,
  object: {
    host: string,
    port: string,
    user: string,
    pass: string,
    data: string
  }
}

export type Comment = {
  type: string,
  target: string,
  content: string
}

export type Table = {
  name: string,
  columns: Array<Column>
}

export type Type = {
  name: string,
  enums: Array<string | number>
}

export type Metas = {
  tables: Array<Table>,
  types: Array<Type>,
  comments: Array<Comment>
}

export type Model = {
  type: string,
  properties?: {
    [key: string]: Model
  },
  description?: string,
  enum?: Array<string | number>,
  nullable?: boolean,
  maxLength?: number,
  minLength?: number,
  minimum?: number,
  maximum?: number,
  exclusiveMinimum?: boolean,
  exclusiveMaximum?: boolean,
  format?: string,
  $ref?: string,
  items?: Model,
  default?: string | number | boolean,
  unique: boolean,
  pattern?: string,
  /**
   * @TODO: additionalProperties type
   */
  additionalProperties: {
    id?: boolean | DataType | Column,
    timestamp?: boolean | 'create_at' | 'update_at' | Array<Column> | Column,
    operator?: boolean | 'create_by' | 'update_by' | Array<Column> | Column,
    softDelete?: boolean | Column,
    primaryKey?: boolean,
    dataType?: string,
    check?: ?SQLExpr
  }
}

export type Options = {
  /**
   * required
   */
  data: {
    [table: string]: Model
  },
  connect: Connect,
  schema?: string,

  /**
   * additional columns
   */
  id?: boolean | DataType | Column,
  timestamp?: boolean | 'create_at' | 'update_at' | Array<Column> | Column,
  operator?: boolean | 'create_by' | 'update_by' | Array<Column> | Column,
  softDelete?: boolean | Column,

  /**
   * cli options
   */
  dryRun?: boolean,
  logLevel?: 'info' | 'verbose',

  /**
   * app status
   */
  metas?: Metas,
  sql?: string,
  connobj?: ConnectOptions
}

const defaultOptions = {
  schema: 'api',
  id: true,
  timestamp: true,
  operator: false,
  softDelete: true,
  dryRun: false,
  logLevel: 'info'
}

export default function main(options: Options): void {
  const { data, connect } = {
    ...defaultOptions,
    ...options
  }

  let [ ok, msg ] = check(data)
  if(!ok) {
    throw new Error(msg)
  }

  options.connobj = parse(connect)

  Promise.resolve(options)
    .then(generate)
    .then(render)
    .then(exec)
    .catch(err => {
      fail('[Migrator]Mirgation failed')
      throw new Error(err)
    })
}
