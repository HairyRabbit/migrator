/**
 * @jest
 */

import validate from './validator'

test('should generate number checker', () => {
  expect(
    validate('foo', {
      type: 'integer',
      minimum: 42
    })
  ).toEqual(
    'foo > 42'
  )

  expect(
    validate('foo', {
      type: 'integer',
      minimum: 42,
      exclusiveMinimum: true,
      maxumum: 88,
      exclusiveMaximum: true,
    })
  ).toEqual(
    'foo >= 42 AND foo <= 88'
  )
})

test('should generate string checker', () => {
  expect(
    validate('foo', {
      type: 'string',
      minLength: 42,
      maxLength: 88
    })
  ).toEqual(
    'char_length(foo) >= 42 AND char_length(foo) <= 88'
  )

  expect(
    validate('foo', {
      type: 'string',
      pattern: '^1\d{10}$'
    })
  ).toEqual(
    `'^1\d{10}$' ~* foo`
  )
})

test('should return undefined', () => {
  expect(
    validate('foo', {
      type: 'string'
    })
  ).toEqual(
    undefined
  )

  expect(
    validate('foo')
  ).toEqual(
    undefined
  )
})
