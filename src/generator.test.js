/**
 * @jest
 */

import generate from './generator'

test('should return generate object', () => {
  expect(
    generate({
      schema: 'api',
      data: {
        foo: {
          type: 'object',
          properties: {
            bar: {
              type: 'integer'
            }
          }
        }
      }
    })
  ).toEqual(
    {
      schema: 'api',
      data: {
        foo: {
          type: 'object',
          properties: {
            bar: {
              type: 'integer'
            }
          }
        }
      },
      metas: {
        tables: [{
          name: 'api.foo',
          columns: [{
            name: 'id',
            type: 'serial',
            primaryKey: true
          },{
            name: 'bar',
            type: 'integer'
          },{
            name: 'create_at',
            type: 'timestamp',
            nullable: false,
            default: 'CURRENT_TIMESTAMP'
          },{
            name: 'update_at',
            type: 'timestamp',
            nullable: false,
            default: 'CURRENT_TIMESTAMP'
          },{
            name: 'delete_at',
            type: 'timestamp',
            nullable: true
          }]
        }],
        types: [],
        comments: []
      }
    }
  )
})

test('should throw when type not be "object"', () => {
  expect(
    () => generate({
      data: {
        foo: {
          type: 'string'
        }
      }
    })
  ).toThrow()
})
