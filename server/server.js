const express = require('express');

//import ApolloServer
const { ApolloServer } = require('apollo-server-express');


//import our typeDefs and resolvers
const{ typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

//create a new Apollo Server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create new instance of ApolloServer with GraphQL schema
const startApolloServer = async(typeDefs, resolvers) =>{
  await server.start();

  //integrate our Apollo server with the express application as middleware
  server.applyMiddleware({ app });


  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // ! log where we can go test our GraphQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};


//Call the async function to start the server
startApolloServer(typeDefs, resolvers);