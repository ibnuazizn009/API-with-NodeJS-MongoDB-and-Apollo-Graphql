const {gql} = require("apollo-server-express");

const typeDefs = gql `

    type Users {
        _id: ID!
        username: String!
        password: String
        createdAt: String!
        updatedAt: String!
    }

    type Books {
        _id: ID!
        title: String!
        desc: String!
        createdAt: String!
        updatedAt: String!
    }

    type AuthLogin {
        userId: ID!
        token: String!
        tokenExpire: Int!
    }

    input UsersInput {
        username: String!
        password: String!
    }

    input BooksInput {
        title: String
        desc: String
    }

    type Query {
        users: [Users!]! 
        getBooks: [Books!]!
        getBook(id: ID) : Books
        login(username: String!, password: String!): AuthLogin!
    }

    type Mutation {
        createUser(user: UsersInput): Users 
        createBook(book: BooksInput): Books 
        updateBook(id: ID!, book: BooksInput): Books 
        deleteBook(id: ID!): String 
    }
`

module.exports = { typeDefs };