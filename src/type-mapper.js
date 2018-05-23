/**
 * Map schema type to the PostgreSQL data type
 *
 * @flow
 */

import type { Model } from './'

type Options = {
  schema: string,
  table: string,
  column: string
}

export default function mapper(prop: Model, options: Options): string {
  const { type, format } = prop || {}
  const { schema, table, column } = options || {}

  /**
   * `belongTo` references
   */
  if(prop['$ref']) {
    return `serial`
  }

  /**
   * Array types, include two cases:
   *  - foreign keys
   *  - normal array type
   *
   * Foreign keys - `hasMany` references
   *
   * ```json
   * "foo": {
   *   "type": "array",
   *   "items": {
   *     "$ref": "table" // other table name
   *   }
   * }
   * ```
   *
   * will generate:
   *
   * ```sql
   * foo serial[] NOT NULL DEFAULT '{}',
   * ```
   *
   * Normal array type
   *
   * ```json
   * "foo": {
   *   "type": "array",
   *   "items": {
   *     "type": "string" // other table name
   *   }
   * }
   * ```
   *
   * will generage:
   *
   * ```sql
   * foo characters varying[] NOT NULL DEFAULT '{}'
   * ```
   */
  if('array' === type) {
    const items = prop.items

    if(!items) {
      throw new Error(
        'Array type require the "items" property, but got undefined'
      )
    }

    if(items[`$ref`]) {
      return `serial[]`
    } else {
      return `${mapper(items, options)}[]`
    }
  }

  /**
   * Enum types
   *
   * Should create type first, just use the created type name.
   * the type name format should be "SCHEMA.TABLE_COLUMN"
   */
  if(undefined !== prop['enum']) {
    if(!Boolean(~['number', 'integer', 'string'].indexOf(type))) {
      throw new Error(
        'enum require integer(number) or string type, ' +
          'but got ' +
          type
      )
    }

    return `${schema}.${table}_${column}`
  }

  /**
   * Basic types
   *
   * includes:
   *  - string
   *  - integer(number)
   *  - boolean
   *  - array (array type, means hasMany, e.g. '{ fid1, fid2, fid3 }')
   *  - object (json type, TODO)
   */

  /**
   * Numeric
   *
   * Postgres numeric types:
   *  - integer(default)
   *  - arbitrary precision numbers
   *  - floating point
   *  - serial
   *
   * +------------------+-------------+-----------------------+
   * | Name             | Size(bytes) | Range                 |
   * +------------------+-------------+-----------------------+
   * | smallint         | 2           | range(-r1, +r1)       |
   * | integer          | 4           | range(-r2, +r2)       |
   * | bigint           | 8           | range(-r3, +r3)       |
   * | decimal          | variable    | digits(131072, 16383) |
   * | numeric          | variable    | digits(131072, 16383) |
   * | real             | 4           | digits(6)             |
   * | double precision | 8           | digits(15)            |
   * | smallserial      | 2           | range(1, r1)          |
   * | serial           | 4           | range(1, r2)          |
   * | bigserial        | 8           | range(1, r3)          |
   * +------------------+-------------+-----------------------+
   *
   * Note:
   *  - r1: 32767
   *  - r2: 2147483674
   *  - r3: 9223372036854775807
   */
  if(Boolean(~['number', 'integer'].indexOf(type))) {
    switch(format) {
        /**
         * default
         */
      case 'integer':
      case 'number':
      case 'int4':
        return 'integer'

        /**
         * number
         */
      case 'float':
        return 'real'
      case 'double':
        return 'double precision'

        /**
         * integer
         */
      case 'int2':
        return 'smallint'
      case 'int8':
        return 'bigint'
      case 'uint':
      case 'uint4':
        return 'serial'
      case 'uint2':
        return 'smallserial'
      case 'uint8':
        return 'bigserial'

        /**
         * variable
         */
      case 'decimal':
      case 'numeric':
        return format

      default:
        if(undefined !== format) {
          console.warn(
            'The numeric type with a incorrect format, ' +
              format +
              ', use the default integer type, "integer"'
          )
        }

        return 'integer'
    }
  }

  /**
   * String
   *
   * Include many format:
   *  - character(default)
   *  - date
   *  - file
   *  - otherwise custom format
   *
   * Postgres character types:
   *  - character varying(default)
   *  - character
   *  - text
   */
  if('string' === type) {
    const max = prop.maxLength

    /**
     * build in formats
     */
    switch(format) {
        /**
         * files
         */
      case 'binary':
        return 'text'
        /**
         * base64 encoded characters
         */
      case 'byte':
        return 'text'
        /**
         * Date and time type
         *
         * full-date, e.g. 2000-10-10
         * date-time, e.g. 2000-10-10T10:10:10
         */
      case 'date':
        return 'date'
      case 'date-time':
        return 'timestamp'
        /**
         * uuid type, 128 bits
         */
      case 'uuid':
        return `uuid`
        /**
         * network address
         */
      case 'ipv4':
      case 'ipv6':
        return `cidr`
      default:
        break
    }

    /**
     * characters
     */
    if('text' === format) {
      return `text`
    } else if('character' === format || 'char' === format) {
      return undefined !== max
        ? `character(${max})`
        : `character`
    } else if(
      'character varying' === format
        || 'varchar' === format
        || undefined === format
    ) {
      return undefined !== max
        ? `character varying(${max})`
        : `character varying`
    }
  }

  /**
   * Boolean type
   */
  if('boolean' === type) {
    return `boolean`
  }

  /**
   * otherwise
   */

  return type
}
