/**
 * SQL render
 *
 * @flow
 */

import type { Options, Column, Comment } from './'

/**
 * Additional columns
 */
export function renderId(options: Options): ?string {
  const { id } = options || {}
  switch(typeof id) {
    case 'boolean':
      return id ? `id SERIAL PRIMARY KEY` : null
    case 'string':
      return `id ${id.toUpperCase()} PRIMARY KEY`
    case 'object':
      return makeColumn(id)
    default:
      return `id SERIAL PRIMARY KEY`
  }
}

export function renderTimestamp(options: Options): ?(Array<string> | string) {
  const { timestamp } = options || {}
  const createAtColumn = `create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
  const updateAtColumn = `update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`

  switch(timestamp) {
    case 'create_at':
      return createAtColumn
    case 'update_at':
      return updateAtColumn
    default:
      if(Array.isArray(timestamp)) {
        return timestamp.map(makeColumn)
      } else if('object' === typeof timestamp) {
        return makeColumn(timestamp)
      } else if(!timestamp) {
        return null
      }

      return [ createAtColumn, updateAtColumn ]
  }
}

export function renderOperator(options: Options): ?(Array<string> | string) {
  const { operator } = options || {}
  const createByColumn = `create_by INTEGER DEFAULT -1`
  const updateByColumn = `update_by INTEGER DEFAULT -1`

  switch(operator) {
    case 'create_by':
      return createByColumn
    case 'update_by':
      return updateByColumn
    default:
      if(Array.isArray(operator)) {
        return operator.map(makeColumn)
      } else if('object' === typeof operator) {
        return makeColumn(operator)
      } else if(!operator) {
        return null
      }

      return [ createByColumn, updateByColumn ]
  }
}

export function renderSoftDelete(options: Options): ?string {
  const { softDelete } = options || {}

  if('object' === typeof softDelete) {
    return makeColumn(softDelete)
  }

  if(!softDelete) {
    return null
  }

  return `delete_at TIMESTAMP`
}

/**
 * Comments
 */

export function renderComment(comment: Comment): string {
  const { type, target, content } = comment || {}

  if(!type) {
    throw new Error(
      'Render Comment type was required'
    )
  } else if(!target) {
    throw new Error(
      'Render Comment target was required'
    )
  } else if(!content) {
    console.warn(
      `Render Comment content on ${type} for ${target} was blank string`
    )
  }

  return `COMMENT ON ${type} ${target} IS '${content}';`
}


export default function render(options: Options): string {

}


function makeColumn(column: Column): string {
  const {
    name,
    type,
    primaryKey,
    nullable,
    unique,
    default: defaultValue,
    check
  } = column

  if(!name) {
    throw new Error(
      'Column name was required, but got undefined'
    )
  }

  if(!type) {
    throw new Error(
      'Column type was required, but got undefined'
    )
  }

  const constraint = []

  if(primaryKey) {
    constraint.push(`PRIMARY KEY`)
  }

  if(nullable) {
    constraint.push(`NOT NULL`)
  }

  if(unique) {
    constraint.push(`UNIQUE`)
  }

  if(defaultValue) {
    constraint.push(`DEFAULT ${defaultValue}`)
  }

  if(check) {
    constraint.push(`CHECK ${check}`)
  }

  const constraintStr = constraint.length ? ' ' + constraint.join(' ') : ''

  return `${name} ${type.toUpperCase()}${constraintStr}`
}
