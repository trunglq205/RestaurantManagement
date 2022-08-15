<template>
  <ul class="flex gap-6">
    <li
      v-for="category in categories"
      :key="category.categoryId"
      :class="[
        'text-base font-semibold cursor-pointer',
        { 'underline-item': type === category.categoryId },
      ]"
      @click="redirect(category.categoryId)"
    >
      {{ category.categoryName }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCategoryStore } from "@/store/category";
import { storeToRefs } from "pinia";
export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const type = ref<string>("");
    const categoryStore = useCategoryStore();
    const { categories } = storeToRefs(categoryStore);

    // watch route category when path change
    watch(
      () => route.path,
      () => {
        if (route.path === "/") {
          type.value = categories.value[0].categoryId;
        }
        type.value = route.path.slice(1);
      }
    );
    // call api
    onMounted(async () => {
      if (route.path === "/") {
        type.value = categories.value[0].categoryId;
      } else {
        type.value = route.path.slice(1);
      }
      await categoryStore.getAllCategory();
    });
    //redirect page by category
    const redirect = (id: string) => {
      router.push({
        path: `/${id}`,
      });
    };

    return { categories, type, redirect };
  },
});
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
.underline-item {
  position: relative;
  color: $primary-color;
  &::before {
    position: absolute;
    content: "";
    width: 60%;
    height: 2px;
    bottom: -0.3rem;
    background: $primary-color;
  }
}
</style>
