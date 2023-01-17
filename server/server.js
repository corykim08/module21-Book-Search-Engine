
const express = require("express");
const path = require("path");
// const routes = require('./routes');
// Import Apollo server and use it as a middleware
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const db = require('./config/connection');

//express server
const app = express();
const PORT = process.env.PORT || 3001;

// Create an apollo server and use typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Apply apollo server to the express server
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
    app.listen(PORT, () => {
        console.log(`🌍 Now listening on localhost:${PORT}`);
        // User are able to test GQL at localhost:3001
        console.log(`GraphQL is available at http://localhost:${PORT}${server.graphqlPath}`);
    });
  }
);

