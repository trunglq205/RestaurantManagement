import api from "@/plugins/api";
import { AuthEndpointsEnum } from "@/constants/auth";
import type { RegisterDef, LoginDef } from "@/types/auth.types";
export const login = ({ username, password }: LoginDef) => {
  return api.post(AuthEndpointsEnum.LOGIN, {
    username,
    password,
  });
};
export const register = ({
  fullname,
  email,
  password,
  phonenumber,
  username,
  position = 0,
}: RegisterDef) => {
  return api.post(AuthEndpointsEnum.REGISTER, {
    fullname,
    email,
    password,
    phonenumber,
    username,
    position,
  });
};
