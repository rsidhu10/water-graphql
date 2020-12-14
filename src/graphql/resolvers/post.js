export default {
  Query: {
    infoPost: async (_, {}, db) => {
      console.log(db);
      return "This is information from POST";
    },
    getAllPosts: async (_, {}, { db }) => {
      let result = await db.Post.findAll();
      return result;
    },
    getPostById: async (_, { id }, { db }) => {
      let result = await db.Post.findByPk(id);
      return result;
    },
  },
  Mutation: {
    createNewPost: async (_, { newPost }, { db }) => {
      let result = await db.Post.create(newPost);
      return result;
    },
    editPostById: async (_, { id, updatedPost }, { db }) => {
      console.log("ID: ", id, "Post : ", updatedPost);
      let result = await db.Post.findByPk(id);
      console.log(`Result : ${result}`);
      result.update(...updatedPost);
      return result;
    },
    deleteById: async (_, { id }, { db }) => {
      let deletedPost = await db.Post.destroy({
        where: { id: id },
      });
      return {
        success: true,
        id: id,
        message: "Record deleted successfully",
      };
    },
  },
};
