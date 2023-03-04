import { g, InferResolvers, Infer, InferArgs } from '../src/index'
import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'

type Blog = {
  title: string
  author: string
}

const blogType = g.type('Blog', {
  title: g.string(),
  author: g.ref<Blog>('User').description('The author of the blog')
}).description('The blog of the user')

const userType = g.type('User', {
  age: g.int(),
  friends: g.ref('User').description('The friends of the user').list().deprecated('wow'),
})

const scalarType = g.scalarType<Date, number>('SC', {
  serialize: (value) => value.getTime(),
  parseValue: (value) => new Date(value)
}).description('The scalar type')

const inputType = g.inputType('UserInput', {
  name: g.string(),
  age: g.int().required(),
}).description('The input type')

const queryType = g.type('Query', {
  greet: g.string().args({
    test: g.ref(scalarType).description('The wow').list(),
  }).description('The greet query'),
})

type x = Infer<typeof queryType>

const union = g.unionType('Union', [userType, blogType])

const resolvers: InferResolvers<{ Query: typeof queryType }, {}> = {
  Query: {
    greet: (parent, args) => 'Hello World'
  }
}

const schema = g.buildSchema({ resolvers })
const yoga = createYoga({ schema })
const server = createServer(yoga)
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
