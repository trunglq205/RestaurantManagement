import { defineStore } from "pinia";
import { ref } from "vue";
import type { CategoryDef } from "@/types/category.type";
import api from "@/plugins/api";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<CategoryDef[]>([
    {
      categoryId: "",
      categoryName: "",
    },
  ]);
  async function getAllCategory() {
    const result = await api.get<CategoryDef[]>("/category");
    if (result) {
      categories.value = result.data;
    }
  }
  return {
    categories,
    getAllCategory,
  };
});
