import { g, InferResolvers, buildSchema, Infer } from './../src/index'
import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'

const user = g.node('UserNode', {
  name: g.string().description('User name'),
})

const userEdge = g.edge('UserEdge', user)
const userConnection = g.connection('UserConnection', userEdge)

const queryType = g.type('Query', {
  users: g.ref(userConnection).args({ ...g.pageInfoArgs })
})

const resolvers: InferResolvers<{ Query: typeof queryType }, {}> = {
  Query: {
    users: (parent, args, context, info) => {
      return {
        edges: [
          {
            node: {
              id: '1',
              name: 'John',
            },
            cursor: '1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '1',
          endCursor: '1',
        }
      }
    }
  }
}

const schema = buildSchema({ g, resolvers })
const yoga = createYoga({ schema })
const server = createServer(yoga)
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
