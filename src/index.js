const { createYoga, createSchema, createPubSub } = require('graphql-yoga')
const fs = require('fs');
const path = require('path')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Post = require('./resolvers/Post')
const User = require('./resolvers/User')
const Comment = require('./resolvers/Comment')
const Subscription = require('./resolvers/Subscription')
const { PrismaClient } = require('./generated/client')
const express = require('express')
const  { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { createServer } = require('http');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const httpServer = createServer(app);

const prisma = new PrismaClient()

const pubsub = createPubSub()
const schema = makeExecutableSchema({
    typeDefs: fs.readFileSync(
        path.join(__dirname,'schema.graphql'),
        'utf8'
    ),
    resolvers: {
        Query ,
        Mutation ,
        Subscription,
        Post ,
        User ,
        Comment 
        
    }
    
})


const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/',
  });

  const serverCleanup = useServer({ 
    schema,
    context: async ({ req }) => ({ 
                request:req,
                pubsub,
                prisma
            })

}, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
  
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  const startServer = async () => {
    await server.start();
  }
  const PORT = process.env.PORT ||  4000;
startServer().then(()=>{
    app.use('/', cors(), bodyParser.json(), expressMiddleware(server, {
        context: async ({ req }) => ({ 
                    request:req,
                    pubsub,
                    prisma
                })
    }));

    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`);
      });
})



// startStandaloneServer(server, {
//     context: async ({ req }) => ({ 
//         request:req,
//         pubsub,
//         prisma
//     }),
//     listen: { port: process.env.PORT || 4000 },
//   })

// const schema = createSchema({
//     typeDefs: fs.readFileSync(
//                 path.join(__dirname,'schema.graphql'),
//                 'utf8'
//             ),
//             resolvers: {
//                 Query ,
//                 Mutation ,
//                 Subscription,
//                 Post ,
//                 User ,
//                 Comment 
                
//             }
// })

// const yoga = createYoga({
//     schema,
//     context: (request)=>{
//         console.log(1)
//         return{
//             pubsub,
//             prisma,
//             request
//         }
//     },
//     graphqlEndpoint:"/"
// })


// app.use("/",yoga)

// app.listen(process.env.PORT|| 4000,()=> {
//     console.log('the server is up 4000')
// })