import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    infoUser: String
    authUser: User!
    authUserProfile: User! @isAuth
    authenticateUser(username: String!, password: String!): AuthResp!
  }

  extend type Mutation {
    registerUser(newUser: UserInput!): AuthResp!
  }

  input UserInput {
    avtarImage: String
    firstname: String!
    lastname: String!
    username: String!
    password: String!
    email: String!
  }

  type User {
    avtarImage: String
    firstname: String!
    lastname: String!
    username: String!
    email: String!
    id: ID!
  }

  type AuthResp {
    user: User!
    token: String!
  }
`;
