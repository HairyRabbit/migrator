/**
 * @jest
 */

import render, {
  renderId,
  renderTimestamp,
  renderSoftDelete,
  renderOperator,
  renderComment
} from './render'

/**
 * make column
 */
test('should throw when without name or type', () => {
  expect(
    () => renderId({
      id: {
        type: 'text',
        primaryKey: false,
        nullable: true,
        default: 1
      }
    })
  ).toThrow()

  expect(
    () => renderId({
      id: {
        name: 'id',
        primaryKey: false,
        nullable: true,
        default: 1
      }
    })
  ).toThrow()
})


/**
 * render id primary key
 */

test('should render id column', () => {
  expect(
    renderId()
  ).toEqual(
    `id SERIAL PRIMARY KEY`
  )
})

test('should render id column with type', () => {
  expect(
    renderId({
      id: 'integer'
    })
  ).toEqual(
    `id INTEGER PRIMARY KEY`
  )
})

test('should render id column with id options', () => {
  expect(
    renderId({
      id: {
        name: 'id',
        type: 'text',
        primaryKey: false,
        nullable: true,
        default: 1
      }
    })
  ).toEqual(
    `id TEXT NOT NULL DEFAULT 1`
  )
})

test('should render null when operator be false', () => {
  expect(
    renderTimestamp({
      id: false
    })
  ).toEqual(
    null
  )
})


/**
 * render timestamp
 */

test('should render create_at and update_at', () => {
  expect(
    renderTimestamp({
      timestamp: true
    })
  ).toEqual(
    [
      `create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
      `update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
    ]
  )
})

test('should render create_at only', () => {
  expect(
    renderTimestamp({
      timestamp: 'create_at'
    })
  ).toEqual(
    `create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
  )
})

test('should render create_at by column option', () => {
  expect(
    renderTimestamp({
      timestamp: {
        name: 'createAt',
        type: 'date'
      }
    })
  ).toEqual(
    `createAt DATE`
  )
})

test('should render create_at and update_at by column options', () => {
  expect(
    renderTimestamp({
      timestamp: [{
        name: 'createAt',
        type: 'date'
      },{
        name: 'updateAt',
        type: 'timestamp'
      }]
    })
  ).toEqual(
    [`createAt DATE`, `updateAt TIMESTAMP`]
  )
})

test('should render null when operator be false', () => {
  expect(
    renderTimestamp({
      timestamp: false
    })
  ).toEqual(
    null
  )
})


/**
 * render soft delete
 */

test('should render delete_at', () => {
  expect(
    renderSoftDelete({
      softDelete: true
    })
  ).toEqual(
    `delete_at TIMESTAMP`
  )
})

test('should render delete_at by column option', () => {
  expect(
    renderSoftDelete({
      softDelete: {
        name: 'deleteAt',
        type: 'date'
      }
    })
  ).toEqual(
    `deleteAt DATE`
  )
})

test('should render null when operator be false', () => {
  expect(
    renderSoftDelete({
      softDelete: false
    })
  ).toEqual(
    null
  )
})


/**
 * render operator
 */

test('should render create_by and update_by', () => {
  expect(
    renderOperator({
      operator: true
    })
  ).toEqual(
    [
      'create_by INTEGER DEFAULT -1',
      'update_by INTEGER DEFAULT -1'
    ]
  )
})

test('should render create_by only', () => {
  expect(
    renderOperator({
      operator: 'create_by'
    })
  ).toEqual(
    'create_by INTEGER DEFAULT -1'
  )
})

test('should render create_by by column option', () => {
  expect(
    renderOperator({
      operator: {
        name: 'createBy',
        type: 'serial'
      }
    })
  ).toEqual(
    `createBy SERIAL`
  )
})

test('should render create_by and update_by by column options', () => {
  expect(
    renderOperator({
      operator: [{
        name: 'createBy',
        type: 'serial'
      },{
        name: 'updateBy',
        type: 'integer'
      }]
    })
  ).toEqual(
    [
      `createBy SERIAL`,
      `updateBy INTEGER`
    ]
  )
})

test('should render null when operator be false', () => {
  expect(
    renderOperator({
      operator: false
    })
  ).toEqual(
    null
  )
})


/**
 * schema
 */

test('should render SQL string', () => {
  expect(
    render({
      schema: 'api',
      tables: [],
      types: []
    })
  ).toEqual(
    `
CREATE SCHEMA api IF NOT EXISTS;
`
  )
})

test('should warning when tables was empty', () => {
  console.warn = jest.fn
  render({
    schema: 'api',
    tables: [],
    types: []
  })
  expect(
    console.warn
  ).toHaveBeenCalled()
})

/**
 * table
 */

test('should render tables SQL strings', () => {
  expect(
    render({
      schema: 'api',
      tables: [{
        table: 'foo',
        columns: []
      }]
    })
  ).toEqual(
    `
CREATE SCHEMA api IF NOT EXISTS;

CREATE TABLE api.foo IF NOT EXISTS (

);
`
  )
})

test('should render tables columns SQL strings', () => {
  expect(
    render({
      schema: 'api',
      tables: [{
        table: 'foo',
        columns: [{
          column: 'bar',
          type: 'integer'
        }]
      }]
    })
  ).toEqual(
    `
CREATE SCHEMA api IF NOT EXISTS;

CREATE TABLE api.foo IF NOT EXISTS (
  id serial PRIMARY KEY,
  bar integer NOT NULL
);
`
  )
})

test('should render tables columns SQL strings without id column', () => {
  expect(
    render({
      schema: 'api',
      tables: [{
        table: 'foo',
        columns: [{
          column: 'bar',
          type: 'integer'
        }]
      }]
    }, {
      primaryColumn: false
    })
  ).toEqual(
    `
CREATE SCHEMA api IF NOT EXISTS;

CREATE TABLE api.foo IF NOT EXISTS (
  bar integer NOT NULL
);
`
  )
})

test('should render tables columns SQL strings with additional columns', () => {
  expect(
    render({
      schema: 'api',
      tables: [{
        table: 'foo',
        columns: [{
          column: 'bar',
          type: 'integer'
        }]
      }]
    }, {
      additionalColumns: true
    })
  ).toEqual(
    `
CREATE SCHEMA api IF NOT EXISTS;

CREATE TABLE api.foo IF NOT EXISTS (
  id serial PRIMARY KEY,
  bar integer NOT NULL,
  create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  create_by serial NOT NULL DEFAULT 1,
  update_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_by serial NOT NULL DEFAULT 1,
  delete_at timestamp DEFAULT NULL
);
`
  )
})

test('should warning when table havn\'t any columns', () => {
  console.warn = jest.fn
  render({
    schema: 'api',
    tables: [{
      table: 'foo',
      columns: []
    }]
  })
  expect(
    console.warn
  ).toHaveBeenCalled()
})


/**
 * comments
 */

test('should render comment', () => {
  expect(
    renderComment({
      type: 'foo',
      target: 'bar',
      content: 'baz'
    })
  ).toEqual(
    `COMMENT ON foo bar IS 'baz';`
  )
})

test('should throw when comment without type or target', () => {
  expect(
    () => renderComment({
      target: 'bar',
      content: 'baz'
    })
  ).toThrow()

  expect(
    () => renderComment({
      type: 'bar',
      content: 'baz'
    })
  ).toThrow()
})

test('should warning when comment content was blank', () => {
  console.warn = jest.fn()
  renderComment({
    type: 'foo',
    target: 'bar',
    content: ''
  })
  expect(
    console.warn
  ).toHaveBeenCalled()
})
