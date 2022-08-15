<template>
  <div>
    <Navbar v-if="isNavbar" />
    <section class="bg-dark min-h-screen pl-[6.5rem]">
      <RouterView />
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "@vue/runtime-core";
import Navbar from "@/components/layouts/Navbar.vue";
import { useRoute } from "vue-router";
export default defineComponent({
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const isNavbar = ref(true);
    watch(
      () => route.path,
      () => {
        if (route.path === "/login") {
          isNavbar.value = false;
        } else {
          isNavbar.value = true;
        }
      }
    );
    return { isNavbar };
  },
});
</script>
<style>
* {
  color: white;
  font-family: "Barlow";
  font-size: 16px;
}
.material-icons-outlined{
  font-family: 'Material Icons Outlined' !important;
}
</style>
