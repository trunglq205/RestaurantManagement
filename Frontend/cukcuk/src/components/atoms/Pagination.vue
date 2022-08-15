<template>
  <v-pagination
    v-model="page"
    :pages="totalPage"
    :range-size="0"
    active-color="#EA7C69"
    @update:modelValue="updateHandler"
  />
</template>

<script>
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPage: {
      type: Number,
      default: 1,
    },
  },
  components: {
    VPagination,
  },
  data() {
    return {
      page: this.currentPage,
    };
  },
  methods: {
    updateHandler(page) {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      searchParams.set("page", page);
      url.search = searchParams.toString();
      const newUrl = url.toString();
      this.$router.push(newUrl);
    },
  },
};
</script>

<style lang="scss">
.Page {
  color: white !important;
  font-size: 18px;
  padding: 0.8rem;
  width: 32px;
  height: 32px;
  border: 1px solid #393C49;
  border-radius: 8px;
}
.Page:hover{
  border-radius: 8px;
}
.Control-active {
  fill: white !important;
}
.Page-active{
  border-radius: 8px;
  border: 1px solid #393C49;
}
.PaginationControl{
  height: 32px;
  width: 32px;
}
.Control{
  height: 32px;
  width: 32px;
}
</style>
