import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    infoPost: String
    getAllPosts: [Post!]! @isAuth
    getPostById(id: ID!): Post!
  }

  type Mutation {
    createNewPost(newPost: InputPost): Post!
    editPostById(updatedPost: InputPost, id: ID!): Post!
    deleteById(id: ID!): PostNotification
  }

  input InputPost {
    title: String!
    content: String!
    featuredImage: String
  }

  type Post {
    id: ID!
    title: String
    content: String
    featuredImage: String
    createdAt: String
    updatedAt: String
  }
  type PostNotification {
    id: ID!
    message: String!
    success: Boolean
  }
`;
