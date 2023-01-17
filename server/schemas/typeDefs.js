// Import gql for Apollo and Express server
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: SavedBookInput): User
        removeBook(bookId: String!): User
    }
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]        
    }
    type Book {   
        _id: ID
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String      
    }
    type Auth {
        token: ID!
        user: User
    }

    input SavedBookInput {
        authors: [String]
        description: String
        bookId: String
        image: String
        forSale: String
        link: String
        title: String
    }
`;

// export the typeDefs
module.exports = typeDefs;