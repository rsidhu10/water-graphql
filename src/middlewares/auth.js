import { SECRET } from "../config";
import { verify } from "jsonwebtoken";
import { UserInputError } from "apollo-server-express";
import { User } from "../models";
const AuthMiddleware = async (req, res, next) => {
  const authHeaders = req.get("Authorization");
  //console.log("AUTH_HEADER", authHeaders);
  if (!authHeaders) {
    req.isAuth = false;
    return next();
  }
  let token = authHeaders.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = verify(token, SECRET);
    //console.log(decodedToken);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  let authUser = await User.findOne({
    where: { id: decodedToken.id },
  });
  console.log("Auth User", authUser);
  if (!authUser) {
    req.isAuth = false;
    return next();
  }
  req.user = authUser;
  req.isAuth = true;
  console.log(authUser);
  return next();
};

export default AuthMiddleware;
