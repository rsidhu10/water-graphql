import { ApolloError } from "apollo-server-express";
import { hash, compare } from "bcryptjs";
import { issueToken, serializeUser } from "../../functions";

export default {
  Query: {
    infoUser: () => {
      return "Hello from User";
    },
    authUserProfile: async (_, {}, { user }) => user,

    authenticateUser: async (_, { username, password }, { db }) => {
      try {
        // Find the user from the database
        let { User } = db;
        let user = await User.findOne({
          where: { username: username },
        });
        // If User is not found
        if (!user) {
          throw new ApolloError("Username not found", "404");
        }
        // If user is found then compare the password
        let isMatch = await compare(password, user.password);
        // If Password don't match
        // console.log(isMatch);
        if (!isMatch) {
          throw new ApolloError("Invalid Password", "403");
        }
        user = await serializeUser(user);
        // Issue Token
        let token = await issueToken(user);
        return {
          user,
          token,
        };
      } catch (err) {
        throw new ApolloError(err.message, 404);
      }
    },
  },
  Mutation: {
    registerUser: async (_, { newUser }, { db }) => {
      try {
        let { User } = db;
        let { email, username } = newUser;
        let user = await User.findOne({
          where: { username: username },
        });
        console.log(`User Name : `, user);
        if (user) {
          throw new ApolloError("Username is already taken.", "403");
        }
        user = await User.findOne({
          where: { email: email },
        });
        console.log(`Email user : `, user);
        if (user) {
          throw new ApolloError("Email is already Registered.", "403");
        }
        user = new User(newUser);
        // Hash the user password
        user.password = await hash(user.password, 10);
        // Save the user to the database
        let result = await user.save();

        result = serializeUser(result);
        // Issue Token
        let token = await issueToken(result);
        return {
          token,
          user: result,
        };
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
  },
};
