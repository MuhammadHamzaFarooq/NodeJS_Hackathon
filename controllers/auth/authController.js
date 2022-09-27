import authServices from "../../services/authServices.js";
import { constructResponse } from "../../utils/helper.js";


const register = async (req, res) => {
  const response = await authServices.register(req.body);
  return constructResponse(res, response);
};

const login = async (req, res) => {
  const response = await authServices.login(req.body);
  return constructResponse(res, response);
};


export default {
    register, 
    login 
};
