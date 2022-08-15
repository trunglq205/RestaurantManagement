<template>
  <div>
    <nav
      class="flex flex-col pl-3 fixed min-h-[100vh] max-h-[100vh] w-[6.5rem] bg-dark-second pt-6 text-primary text-[26px] overflow-hidden"
    >
      <img
        src="../../assets/cukcuk.png"
        class="w-[45px] h-[45px] object-cover mb-6 ml-5"
        alt=""
      />
      <div v-for="routes in ROUTES" :key="routes.name">
        <router-link
          :to="routes.path"
          :class="[
            'menu-item',
            {
              active:
                route.name == routes.name ||
                (route.name === 'category' && routes.name === 'home'),
            },
          ]"
        >
          <div
            class="dark-second-color text-primary flex-center w-[56px] h-[56px] rounded-lg"
          >
            <span class="material-icons-outlined">{{ routes.icon }}</span>
          </div>
        </router-link>
      </div>
      <div class="logout" @click="logout()">
        <span class="material-icons-outlined text-3xl cursor-pointer">
          logout
        </span>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "@/constants/routers";
export default defineComponent({
  name: "NavBar",
  setup() {
    const route = useRoute();
    const router = useRouter();
    onMounted(() => {
      const params = route.params;
      if (params) {
        type.value = Number(params);
      }
    });
    const type = ref<number>(1);
    //logout
    const logout = () => {
      router.push({ path: "/login" });
    };
    return { ROUTES, type, logout, route };
  },
});
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
.menu {
  background-color: #18273b;
  padding: 50px 0 50px 15px;
  border-radius: 16px;
  width: 250px;
}
.menu-item {
  padding: 15px;
  border-radius: 12px 0 0 12px;
  display: flex;
  align-items: center;
  color: $primary-color;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  margin-bottom: 10px;
}
.menu-item.active:before {
  content: "";
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  transform: translateY(-100%);
  box-shadow: 10px 10px 0 0 $dark-color;
}
.menu-item.active:after {
  content: "";
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  transform: translateY(100%);
  box-shadow: 10px -10px 0 0 $dark-color;
}
.menu-item.active {
  background-color: $dark-color;
  color: $primary-color;
}
.active > div {
  background: $primary-color;
  color: white;
}
.logout {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>
