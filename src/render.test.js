/**
 * @jest
 */

import render, {
  renderId,
  renderTimestamp,
  renderSoftDelete,
  renderOperator,
  renderComment,
  renderType,
  renderTable
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
 * Enum types
 */

test('should render enum types', () => {
  expect(
    renderType({
      name: 'foo',
      enums: ['bar', 'baz']
    })
  ).toEqual(
    `\
CREATE TYPE foo AS ENUM (
  'bar', 'baz'
);`
  )
})

test('should render enum types without string type items', () => {
  expect(
    renderType({
      name: 'foo',
      enums: [1, 2]
    })
  ).toEqual(
    `\
CREATE TYPE foo AS ENUM (
  1, 2
);`
  )
})

test('should warning when render enum types with blank enums', () => {
  console.warn = jest.fn()
  renderType({
    name: 'foo',
    enums: []
  })
  expect(
    console.warn
  ).toHaveBeenCalled()
})

test('should throw when type name or type not provied', () => {
  expect(
    () => renderType({

    })
  ).toThrow()

  expect(
    () => renderType({
      name: 'foo'
    })
  ).toThrow()

  expect(
    () => renderType({
      name: 'foo',
      enums: 'bar'
    })
  ).toThrow()
})


/**
 * tables
 */
test('should render table with empty columns', () => {
  expect(
    renderTable({
      name: 'foo',
      columns: []
    })
  ).toEqual(
    `CREATE TABLE foo IF NOT EXISTS ();`
  )
})

test('should render table with column', () => {
  expect(
    renderTable({
      name: 'foo',
      columns: [{
        name: 'bar',
        type: 'integer'
      }]
    })
  ).toEqual(
    `\
CREATE TABLE foo IF NOT EXISTS (
  bar INTEGER
);`
  )
})

test('should render table with columns', () => {
  expect(
    renderTable({
      name: 'foo',
      columns: [{
        name: 'bar',
        type: 'integer'
      },{
        name: 'baz',
        type: 'text'
      }]
    })
  ).toEqual(
    `\
CREATE TABLE foo IF NOT EXISTS (
  bar INTEGER,
  baz TEXT
);`
  )
})

test('should warning when columns was empty', () => {
  console.warn = jest.fn()
  renderTable({
    name: 'foo',
    columns: []
  })
  expect(
    console.warn
  ).toHaveBeenCalled()
})

test('should throw when name or columns not provided', () => {
  expect(
    () => renderTable()
  ).toThrow()

  expect(
    () => renderTable({
      name: 'foo'
    })
  ).toThrow()
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
    `COMMENT ON FOO bar IS 'baz';`
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


/**
 * all
 */

test('should render SQL strings', () => {
  expect(
    render({
      schema: 'api',
      metas: {
        types: [{
          name: 'foo',
          enums: []
        }]
      }
    })
  ).toEqual(
    `
BEGIN;

CREATE SCHEMA api IF NOT EXISTS;

CREATE TYPE foo AS ENUM ();

COMMIT;
`
  )

  expect(
    render({
      schema: 'api',
      metas: {
        types: [{
          name: 'foo',
          enums: ['bar', 'baz']
        }]
      }
    })
  ).toEqual(
    `
BEGIN;

CREATE SCHEMA api IF NOT EXISTS;

CREATE TYPE foo AS ENUM (
  'bar', 'baz'
);

COMMIT;
`
  )

  expect(
    render({
      schema: 'api',
      metas: {
        tables: [{
          name: 'foo',
          columns: []
        }]
      }
    })
  ).toEqual(
    `
BEGIN;

CREATE SCHEMA api IF NOT EXISTS;

CREATE TABLE foo IF NOT EXISTS ();

COMMIT;
`
  )

  expect(
    render({
      schema: 'api',
      metas: {
        tables: [{
          name: 'foo',
          columns: [{
            name: 'bar',
            type: 'integer'
          },{
            name: 'baz',
            type: 'text'
          }]
        }]
      }
    })
  ).toEqual(
    `
BEGIN;

CREATE SCHEMA api IF NOT EXISTS;

CREATE TABLE foo IF NOT EXISTS (
  bar INTEGER,
  baz TEXT
);

COMMIT;
`
  )

  expect(
    render({
      schema: 'api',
      metas: {
        types: [{
          name: 'foo',
          enums: []
        }],
        tables: [{
          name: 'bar',
          columns: []
        }],
        comments: [{
          type: 'table',
          target: 'baz',
          content: 'qux'
        }]
      }
    })
  ).toEqual(
    `
BEGIN;

CREATE SCHEMA api IF NOT EXISTS;

CREATE TYPE foo AS ENUM ();

CREATE TABLE bar IF NOT EXISTS ();

COMMENT ON TABLE baz IS 'qux';

COMMIT;
`
  )

  expect(
    render({
      schema: 'api',
      metas: {
        types: [{
          name: 'foo',
          enums: ['foo1', 'foo2']
        }],
        tables: [{
          name: 'bar',
          columns: [{
            name: 'bar1',
            type: 'integer',
            primaryKey: true
          },{
            name: 'bar2',
            type: 'text',
            nullable: true
          }]
        },{
          name: 'barr',
          columns: [{
            name: 'barr1',
            type: 'integer',
            primaryKey: true
          },{
            name: 'barr2',
            type: 'text',
            nullable: true
          }]
        }],
        comments: [{
          type: 'table',
          target: 'baz',
          content: 'qux'
        },{
          type: 'column',
          target: 'baz1',
          content: 'quxx'
        }]
      }
    })
  ).toEqual(
    `
BEGIN;

CREATE SCHEMA api IF NOT EXISTS;

CREATE TYPE foo AS ENUM (
  'foo1', 'foo2'
);

CREATE TABLE bar IF NOT EXISTS (
  bar1 INTEGER PRIMARY KEY,
  bar2 TEXT NOT NULL
);
CREATE TABLE barr IF NOT EXISTS (
  barr1 INTEGER PRIMARY KEY,
  barr2 TEXT NOT NULL
);

COMMENT ON TABLE baz IS 'qux';
COMMENT ON COLUMN baz1 IS 'quxx';

COMMIT;
`
  )
})
