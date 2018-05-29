/**
 * Json data checker
 *
 * @TODO: linter supports
 * @flow
 */

import type { Options } from './'

export default function check(data: $PropertyType<Options, 'data'>): [boolean, ?string] {
  return [true, null]
}
