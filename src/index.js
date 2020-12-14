import express from "express";
import { PORT, IN_PROD, DB_PASSCODE, DB_USER, DB_DATABASE } from "./config";
import { success, error } from "consola";
import db from "./models";
import { ApolloServer } from "apollo-server-express";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import path from "path";
import AuthMiddleware from "./middlewares/auth";
//import { schemaDirectives } from "./graphql/directives";

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, "./graphql/schema"))
);
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./graphql/resolvers"))
);
//console.log(typeDefs);
//console.log(resolvers);
const server = new ApolloServer({
  typeDefs,
  resolvers,

  playground: IN_PROD,
  context: ({ req }) => {
    let { isAuth, user } = req;
    return {
      req,
      isAuth,
      user,
      db,
    };
  },
});
console.log(IN_PROD);
const app = express();
app.use(AuthMiddleware);
console.log(`PORT No ${PORT}`);

const startApp = async () => {
  try {
    //*********************** */
    await db.sequelize
      .sync({
        force: false,
      })
      .then(() => {
        success({
          badge: true,
          message: `Successfully connected with Database`,
        });
      })
      .then(() => {
        server.applyMiddleware({ app });
        app.listen(PORT, () => {
          success({
            badge: true,
            message: `Server is running on port ${PORT}`,
          });
        });
      })
      .catch((err) => {
        error({
          badge: true,
          message: err.message,
        });
      });
    //*********************** */
  } catch (err) {
    error({
      badge: true,
      message: err.message,
    });
  }
};

startApp();
