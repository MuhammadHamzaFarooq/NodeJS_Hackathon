import { HTTP_STATUS } from "../utils/constant.js";
import { errorResponse, successResponse } from "../utils/helper.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (data) => {
  try {
    const { name, email, password, confirmPassword } = data;
    if (
      name !== undefined &&
      email !== undefined &&
      password !== undefined &&
      confirmPassword !== undefined
    ) {
      let user = await User.findOne({ email });
      if (user === null) {
        if (password === confirmPassword) {
          try {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            let userDetail = {
              name,
              email,
              password: hashPassword,
            };
            let newUser = await User.create(userDetail);
            let save_user = await User.findOne({ email });
            let payload = {
              name: save_user.name,
              email: save_user.email,
              password: save_user.password,
            };

            //Generate Token
            let token = jwt.sign(payload, process.env.SECERET_KEY, {
              expiresIn: "1d",
            });

            let result = {
              token,
              user: payload,
            };
            return successResponse(
              result,
              HTTP_STATUS.OK,
              "User Registered Successfully!!!"
            );
          } catch (error) {
            console.log(error);
            return errorResponse(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              "Enable to register",
              null
            );
          }
        } else {
          return errorResponse(
            HTTP_STATUS.CONFLICT,
            "Password does not match your confirm password",
            null
          );
        }
      } else {
        return errorResponse(
          HTTP_STATUS.CONFLICT,
          "This email already exist please try to unqiue email.",
          null
        );
      }
    } else {
      return errorResponse(
        HTTP_STATUS.NO_CONTENT,
        "All fields are required",
        null
      );
    }
  } catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
};

const login = async (data) => {
  try {
    const { email, password } = data;
    if (email !== undefined && password !== undefined) {
      let user = await User.findOne({ where: { email: email } });
      if (user !== null) {
        let hasPassword = user?.dataValues?.password;
        let isMatch = bcrypt.compareSync(password, hasPassword);

        let payload = {
          name: user?.dataValues?.name,
          email: user?.dataValues?.email,
        };

        if (isMatch) {
          //Generate Token
          let token = jwt.sign(payload, process.env.SECERET_KEY, {
            expiresIn: "1d",
          });

          let result = {
            token,
            user: payload,
          };
          return successResponse(
            result,
            HTTP_STATUS.OK,
            "User Login Successfully Login"
          );
        } else {
          return errorResponse(
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid password",
            null
          );
        }
      } else {
        return errorResponse(HTTP_STATUS.NO_CONTENT, "Unauthorized user", null);
      }
    } else {
      return errorResponse(
        HTTP_STATUS.NO_CONTENT,
        "All fields are required",
        null
      );
    }
  } catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
};

export default {
  register,
  login,
};
