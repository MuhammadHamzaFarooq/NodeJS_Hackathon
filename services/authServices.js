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
              _id: save_user._id,
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
      let user = await User.findOne({ email });
      if (user !== null) {
        let hasPassword = user?.password;
        let isMatch = bcrypt.compareSync(password, hasPassword);

        let payload = {
          _id: user?._id,
          email: user?.email,
          password: hasPassword,
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
        return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Unauthorized user", null);
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

const getUser = async (data) => {
  try {
    const { user_id } = data;
    if (user_id !== null && user_id !== undefined) {
      let user = await User.findById({ _id: user_id });
      if (user !== null) {
        return successResponse(
          user,
          HTTP_STATUS.OK,
          "Get User Details Successfully"
        );
      }
      else {
        return errorResponse(HTTP_STATUS.NOT_FOUND, "User Not Exist", null);
      }
    }
    else {
      return errorResponse(
        HTTP_STATUS.NO_CONTENT,
        "User id is required",
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
}

const updateUser = async (data) => {
  try {
    const { name, email, password, user_id } = data;
    if (user_id !== null) {
      try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        let updateUser = await User.findOneAndUpdate(
          { _id: user_id },
          {
            name, email, password: hashPassword,
          }
        );
        if (
          updateUser.length === 0 ||
          updateUser === undefined ||
          updateUser === null ||
          updateUser === ""
        ) {
          return errorResponse(HTTP_STATUS.NOT_FOUND, "User Not Exist", null);
        } else {
          let save_user = await User.findOne({ email });
          let payload = {
            _id: save_user._id,
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
            "User Updated Successfully!!!"
          );
        }
      } catch (error) {
        console.log(error);
        return errorResponse(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Enable to Update.",
          null
        );
      }
    } else {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Unauthorized user", null);
    }
  }
  catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
}

const deleteUser = async (data) => {
  try {
    const { user_id } = data;
    if (user_id === null || user_id === undefined) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "UnAuthorized User", null);
    }
    else {
      let deleteUser = await User.deleteOne({ _id: user_id });
      if (
        deleteUser["deletedCount"] === 0 ||
        deleteUser === null ||
        deleteUser === undefined
      ) {
        return errorResponse(HTTP_STATUS.NOT_FOUND, "User Does Not Exist", null);
      } else if (
        deleteUser["deletedCount"] === 1 ||
        deleteUser !== null ||
        deleteUser !== undefined
      ) {
        return successResponse(
          deleteUser,
          HTTP_STATUS.OK,
          "User Deleted Successfully"
        );
      }
    }
  } catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
}

export default {
  register,
  login,
  getUser,
  updateUser,
  deleteUser
};
