/**
 * @jest
 */

import check from './checker'

test('should check true', () => {
  expect(
    check()
  ).toEqual(
    [true, null]
  )
})
