<template>
  <div
    class="bg-dark min-h-[100vh] min-w-full flex justify-center items-center"
  >
    <Form
      class="bg-dark-second px-6 w-[405px]"
      @submit="submit"
      v-slot="{ meta }"
    >
      <p class="text-left font-28 mt-6 text-white text-2xl">
        {{ isLogin ? "Login" : "Sign up" }}
      </p>
      <p class="my-5 bg-[#393C49] w-full h-[1px]"></p>
      <template v-if="!isLogin">
        <div class="mb-3">
          <p class="text-white font-14 mb-1 text-sm">Email</p>
          <FormInput
            class="text-white outline-none"
            :height="46"
            v-model="formLogin.email"
            name="Email"
            rules="required|email"
          />
        </div>
        <div class="mb-3">
          <p class="text-white font-14 mb-1 text-sm">Họ và tên</p>
          <FormInput
            class="text-white outline-none"
            :height="46"
            v-model="formLogin.fullname"
            name="Họ và tên"
            rules="required"
          />
        </div>
      </template>
      <div class="mb-3">
        <p class="text-white font-14 mb-1 text-sm">Username</p>
        <FormInput
          class="text-white outline-none"
          :height="46"
          v-model="formLogin.username"
          name="Username"
          rules="required"
        />
      </div>
      <div class="mb-3">
        <p class="text-white font-14 mb-1 text-sm">Password</p>
        <FormInput
          class="text-white outline-none"
          :height="46"
          v-model="formLogin.password"
          type="password"
          name="Mật khẩu"
          rules="required"
        />
      </div>
      <div v-if="!isLogin" class="mb-3">
        <p class="text-white font-14 mb-1 text-sm">Phonenumber</p>
        <FormInput
          class="text-white outline-none"
          :height="46"
          v-model="formLogin.phonenumber"
          name="Số điện thoại"
          :rules="{
            required: true,
          }"
        />
      </div>
      <p v-if="status.error" class="text-xs text-red-500">
        {{
          isLogin ? "Sai tài khoản hoặc mật khẩu." : "Tên tài khoản đã tồn tại"
        }}
      </p>
      <p class="my-5 bg-[#393C49] w-full h-[1px]"></p>
      <button
        class="btn-primary w-full text-white text-center bg-primary py-[14px] rounded-lg text-sm flex-center"
        type="submit"
        :class="{ 'opacity-80': !meta.valid }"
      >
        <CircleProgress v-if="status.loading" />
        <span>{{ isLogin ? "Sign in" : "Sign up" }}</span>
      </button>
      <p
        class="underline text-primary text-center mt-4 mb-6 cursor-pointer"
        @click="changeAction"
      >
        {{ !isLogin ? "Sign in" : "Sign up" }}
      </p>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "@vue/runtime-core";
import FormInput from "@/components/atoms/FormInput.vue";
import { useAuthStore } from "@/store/auth";
import CircleProgress from "@/components/atoms/CircleProgress.vue";
import { Form } from "vee-validate";
import type { LoginDef, RegisterDef } from "@/types/auth.types";
export default defineComponent({
  components: {
    FormInput,
    CircleProgress,
    Form,
  },
  setup() {
    const isLogin = ref<boolean>(true);
    const authStore = useAuthStore();
    const { register, login, status } = authStore;
    const formLogin = reactive<RegisterDef>({
      username: "",
      password: "",
      email: "",
      fullname: "",
      phonenumber: "",
    });
    const isLoginFail = ref(false);
    const submit = async () => {
      if (isLogin.value) {
        await login({
          username: formLogin.username,
          password: formLogin.password,
        } as LoginDef);
      } else {
        await register(formLogin);
      }
    };
    const changeAction = () => {
      isLogin.value = !isLogin.value;
      authStore.$state.status.error = false;
    };
    return { formLogin, isLogin, isLoginFail, status, submit, changeAction };
  },
  methods: {
    change(val: string) {
      this.formLogin.username = val;
    },
  },
});
</script>

<style></style>
