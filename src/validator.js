/**
 * columns validator
 *
 * @flow
 */

import type { Model } from './'

export default function valide(name: string, column: Model): ?string {
  const {
    pattern,
    minimum,
    maximum,
    exclusiveMinimum,
    exclusiveMaximum,
    minLength,
    maxLength,
    format,
    type
  } = column || {}

  if(Boolean(~['number', 'integer'].indexOf(type))) {
    const cond = []

    if(minimum) {
      const symbol = exclusiveMinimum ? '>=' : '>'
      cond.push(`${name} ${symbol} ${minimum}`)
    }

    if(maximum) {
      const symbol = exclusiveMinimum ? '<=' : '<'
      cond.push(`${name} ${symbol} ${maximum}`)
    }

    if(cond.length) {
      return cond.join(' AND ')
    }
  }

  if('string' === type) {
    const cond = []

    if(minLength) {
      cond.push(`char_length(${name}) >= ${minLength}`)
    }

    /**
     * @TODO: duplicate with data type
     */
    if(maxLength) {
      cond.push(`char_length(${name}) <= ${maxLength}`)
    }

    if(pattern) {
      cond.push(`'${pattern}' ~* ${name}`)
    }

    /**
     * @TODO: build in format, e.g. email, phoneNumber
     */

    if(cond.length) {
      return cond.join(' AND ')
    }
  }

  return undefined
}
