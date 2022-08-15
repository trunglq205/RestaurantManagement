import type { LoginDef, RegisterDef } from "@/types/auth.types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import {
  login as loginUser,
  register as registerUser,
} from "@/services/auth/auth";
import { useRouter } from "vue-router";
export interface User {
  id: string | null;
  username: string;
  email: string;
  fullname: string;
  position: number | null;
  phonenumber: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = reactive<User>({
    id: "",
    username: "",
    email: "",
    fullname: "",
    position: null,
    phonenumber: "",
  });
  const status = reactive({
    loading: false,
    error: false,
  });
  const router = useRouter();
  async function login({ username, password }: LoginDef) {
    status.loading = true;
    status.error = false;
    try {
      const result = await loginUser({ username, password });
      if (result) {
        const { userId, email, userName, fullName, phoneNumber, position } =
          result.data;
        user.id = userId;
        user.email = email;
        user.username = userName;
        user.fullname = fullName;
        user.phonenumber = phoneNumber;
        user.position = position;
        status.loading = false;
        router.push("/");
      }
    } catch {
      status.loading = false;
      status.error = true;
    }
  }
  async function register({
    username,
    email,
    fullname,
    password,
    phonenumber,
  }: RegisterDef) {
    status.loading = true;
    status.error = false;
    try {
      const result = await registerUser({
        username,
        email,
        fullname,
        password,
        phonenumber,
      });
      if (result) {
        const { userId, email, userName, fullName, phoneNumber, position } =
          result.data;
        user.id = userId;
        user.email = email;
        user.username = userName;
        user.fullname = fullName;
        user.phonenumber = phoneNumber;
        user.position = position;
        status.loading = false;
        router.push("/");
      }
    } catch {
      status.loading = false;
      status.error = true;
    }
  }
  return {
    user: user,
    login,
    register,
    status,
  };
});
