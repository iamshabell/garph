import { g, InferClient, ClientTypes } from '../src'

const tType = g.type('Query', {
  test: g.string().list().description('Greets a person')
})

const queryType = g.type('Query', {
  greet: g.ref<typeof tType>('')
    .list()
    .args({
      name: g.ref<typeof tType>('').optional().default({ test: ['sdf'] }),
    })
    .description('Greets a person')
})

export function createClient <T extends ClientTypes> (): InferClient<T> {
  return null as any
}

const client = createClient<{ query: typeof queryType }>()
client.query.greet({ name: { test: ['sdf'] } }).forEach((x) => x.test)