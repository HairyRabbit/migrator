/**
 * @jest
 */

import parse from './parser'

beforeEach(() => {
  delete process.env.PGUSER
  delete process.env.PGPASSORD
  delete process.env.PGHOST
  delete process.env.PGPORT
  delete process.env.PGDATABASE
  delete process.env.USER
})


test('should return default connect string', () => {
  expect(
    parse().string
  ).toEqual(
    'postgresql://postgres@127.0.0.1:5432/postgres'
  )
})

test('should parse connect string', () => {
  expect(

    parse('postgresql://foo:bar@baz:42/qux').string
  ).toEqual(
    'postgresql://foo:bar@baz:42/qux'
  )
})

test('should parse connect string without password', () => {
  expect(
    parse('postgresql://foo@baz:42/qux').string
  ).toEqual(
    'postgresql://foo@baz:42/qux'
  )
})

test('should parse connect string without username and password', () => {
  expect(
    parse('postgresql://baz:42/qux').string
  ).toEqual(
    'postgresql://postgres@baz:42/qux'
  )
})

test('should parse connect string without database', () => {
  expect(
    parse('postgresql://foo@baz:42').string
  ).toEqual(
    'postgresql://foo@baz:42/postgres'
  )
})

test('should throw when protocol not be postgresql', () => {
  expect(
    () => parse('foo://bar')
  ).toThrow()
})


test('should parse connect object', () => {
  expect(
    parse({
      user: 'foo',
      pass: 'bar',
      host: 'baz',
      port: 42,
      data: 'qux'
    }).string
  ).toEqual(
    'postgresql://foo:bar@baz:42/qux'
  )
})

test('should parse connect object without password', () => {
  expect(
    parse({
      user: 'foo',
      host: 'baz',
      port: 42,
      data: 'qux'
    }).string
  ).toEqual(
    'postgresql://foo@baz:42/qux'
  )
})
