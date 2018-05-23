/**
 * @jest
 */

import map from './type-mapper'

/**
 * belongTo
 */
test('belongTo refs should be serial type', () => {
  expect(
    map({ ['$ref']: 'foo' })
  ).toEqual(
    'serial'
  )
})

/**
 * array type
 */

test('hasMany refs should be serial[] type', () => {
  expect(
    map({ type: 'array', items: { ['$ref']: 'foo' } })
  ).toEqual(
    'serial[]'
  )
})

test('should be array item type', () => {
  expect(
    map({ type: 'array', items: { type: 'integer' }})
  ).toEqual(
    'integer[]'
  )
})

test('should throw when not provide items', () => {
  expect(
    () => map({ type: 'array' })
  ).toThrow()
})

/**
 * enmu type
 */

test('should be enum type', () => {
  expect(
    map(
      { type: 'string', enum: ['foo', 'bar', 'baz'] },
      { schema: 'schema', table: 'table', column: 'column' }
    )
  ).toEqual(
    'schema.table_column'
  )
})

/**
 * basic type
 */

/**
 * Numeric types
 */
test('should be int', () => {
  /**
   * integer
   */
  expect(
    map({ type: 'integer' })
  ).toEqual(
    'integer'
  )

  expect(
    map({ type: 'integer', format: 'int2' })
  ).toEqual(
    'smallint'
  )

  expect(
    map({ type: 'integer', format: 'int8' })
  ).toEqual(
    'bigint'
  )

  expect(
    map({ type: 'integer', format: 'uint' })
  ).toEqual(
    'serial'
  )

  expect(
    map({ type: 'integer', format: 'uint2' })
  ).toEqual(
    'smallserial'
  )

  expect(
    map({ type: 'integer', format: 'uint8' })
  ).toEqual(
    'bigserial'
  )

  /**
   * float
   */

  expect(
    map({ type: 'number' })
  ).toEqual(
    'integer'
  )

  expect(
    map({ type: 'number', format: 'float' })
  ).toEqual(
    'real'
  )

  expect(
    map({ type: 'number', format: 'double' })
  ).toEqual(
    'double precision'
  )

  /**
   * variable
   */
  expect(
    map({ type: 'number', format: 'decimal' })
  ).toEqual(
    'decimal'
  )
})

test('should warning when numeric type with a incorrect format', () => {
  console.warn = jest.fn()
  map({ type: 'number', format: 'foo' })
  expect(
    console.warn
  ).toHaveBeenCalled()
})


/**
 * Text type
 */

test('should be varchar', () => {
  expect(
    map({ type: 'string' })
  ).toEqual(
    'character varying'
  )

  expect(
    map({ type: 'string', format: 'text' })
  ).toEqual(
    'text'
  )

  expect(
    map({ type: 'string', maxLength: 32 })
  ).toEqual(
    'character varying(32)'
  )

  expect(
    map({ type: 'string', maxLength: 42, format: 'char' })
  ).toEqual(
    'character(42)'
  )

  expect(
    map({ type: 'string', format: 'char' })
  ).toEqual(
    'character'
  )

  /**
   * build in types
   */
  expect(
    map({ type: 'string', format: 'date' })
  ).toEqual(
    'date'
  )

  expect(
    map({ type: 'string', format: 'date-time' })
  ).toEqual(
    'timestamp'
  )

  expect(
    map({ type: 'string', format: 'ipv4' })
  ).toEqual(
    'cidr'
  )

  expect(
    map({ type: 'string', format: 'binary' })
  ).toEqual(
    'text'
  )

  expect(
    map({ type: 'string', format: 'uuid' })
  ).toEqual(
    'uuid'
  )
})

test('should be boolean', () => {
  expect(
    map({ type: 'boolean' })
  ).toEqual('boolean')
})
