import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get Token from header
      try {
        token = authorization.split(" ")[1];
        if (!token) {
          res
            .status(401)
            .send({ status: "failed", message: "Unauthorized User, No Token" });
        } else {
          // Verify Token
          const { email } = jwt.verify(token, process.env.SECERET_KEY);

          // Get User from Token
          let user = await User.findOne({ email });
          if (user) {
            next();
          } else {
            res
              .status(401)
              .send({ status: "failed", message: "Unauthorized User" });
          }
        }
      } catch (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No Token" });
  }
};

export default checkUserAuth;
