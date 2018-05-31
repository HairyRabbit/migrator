/**
 * @jest
 */

import path from 'path'
import read from './reader'

global.__non_webpack_require__ = require

jest.mock('fs', () => ({
  readFileSync: (filePath) => {
    if(filePath === './baz.json') {
      return '{'
    }

    if(filePath.endsWith('json')) {
      return '{ "foo": 42 }'
    } else if(filePath.endsWith('yaml')) {
      return 'foo: 42\nbar: "baz"'
    }

    return undefined
  }
}))

jest.mock('./foo.js', () => ({ foo: 42 }), {
  virtual: true
})

jest.mock('./bar.js', () => ({
  default: { foo: 42 }
}), {
  virtual: true
})

test('should read json file', () => {
  expect(
    read('./foo.json')
  ).toEqual(
    { foo: 42 }
  )
})

test('should read yaml file', () => {
  expect(
    read('./foo.yaml')
  ).toEqual(
    { foo: 42, bar: "baz" }
  )
})

test('should read js file', () => {
  expect(
    read('./foo.js')
  ).toEqual(
    { foo: 42 }
  )
})

test('should read js file with default export', () => {
  expect(
    read('./bar.js')
  ).toEqual(
    { foo: 42 }
  )
})

test('should throw when file type unsupported', () => {
  expect(
    () => read('./foo.bar')
  ).toThrow()
})


test('should throw when load content failed', () => {
  expect(
    () => read('./baz.json')
  ).toThrow()
})
