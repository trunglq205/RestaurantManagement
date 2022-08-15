<template>
  <div class="bg-dark min-h-[100vh] text-white pl-14 pt-8 pr-14">
    <div class="home-header">
      <div><p class="text-3xl">Cukcuk Restaurant</p></div>
      <div>
        <FormInput
          class=""
          name="searchMenu"
          placeholder="Tìm kiếm món ăn..."
          icon="search"
          v-model="keySearch"
        />
      </div>
    </div>
    <!-- <p class="mb-6 mt-1">{{GetTimeNow()}}</p>
    <p class="mt-6 text-xl font-bold">Thực đơn</p> -->
    <Menu class="mt-3 mb-14" />
    <div class="flex-center div-loading" v-if="isLoading">
      <CircleProgress :height="35" :width="35" />
    </div>
    <div class="grid grid-cols-192 place-content-between gap-10">
      <Food
        v-for="food in listFood"
        :key="food.menuId"
        :id="food.menuId"
        :name="food.menuName"
        :price="food.price"
        :url_image="food.image"
        @openModal="openModal"
      />
    </div>
    <div class="flex-center mt-3">
      <div>
        <Pagination
          :currentPage="pagination.currentPage"
          :totalPage="pagination.totalPage"
        />
      </div>
    </div>
    <Modal v-model="isShow" :close="closeModal">
      <div
        class="
          modal
          min-h-screen
          bg-dark-second
          min-w-[450px]
          absolute
          top-0
          right-0
          rounded-lg
          text-white
          p-6
        "
      >
        <Form @submit="submit()">
          <h1 style="font-weight: 600; font-size: 20px">Order</h1>
          <div>
            <p>Số bàn</p>
            <FormInput
              v-model="listOrders.tableNumber"
              name="Số bàn"
              rules="required"
            />
          </div>
          <table>
            <thead>
              <tr style="height: 40px">
                <td width="250">Tên món</td>
                <td width="70">Số lượng</td>
                <td width="100" style="text-align: right">Giá tiền</td>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="(order, index) in listOrders.orderDetails"
                :key="index"
              >
                <tr>
                  <td>
                    <div class="flex mt-8">
                      <div>
                        <img
                          class="w-[45px] h-[45px] rounded-full"
                          :src="order.menu.image"
                          alt=""
                        />
                      </div>
                      <div>
                        <p>&nbsp;{{ order.menu.menuName }}</p>
                        <p>
                          &nbsp;{{
                            formatMoney(order.menu.price.toString())
                          }}
                          VNĐ
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="mt-8">
                      <FormInput
                        class="text-white outline-none mt-8"
                        :height="46"
                        v-model.number="order.amount"
                        name="Số lượng"
                      />
                    </div>
                  </td>
                  <td>
                    <p class="mt-8">
                      {{
                        formatMoney(
                          (order.menu.price * order.amount).toString()
                        )
                      }}
                      VNĐ
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormInput
                      class="text-white outline-none"
                      :height="46"
                      v-model="order.note"
                      name="Ghi chú"
                    />
                  </td>
                  <td>
                    <button
                      class="text-primary p-1 rounded-lg ml-3"
                      style="border: 1px solid #ea7c69"
                    >
                      <span
                        class="material-icons-outlined text-3xl"
                        @click="deleteOrder(index)"
                        style="color: #ea7c69"
                      >
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="flex justify-between mt-7 mb-5">
            <span> Tổng tiền: </span>
            <span> {{ formatMoney(totalPrice.toString()) }} VNĐ </span>
          </div>
          <button
            class="w-full text-white bg-primary rounded-lg py-2 flex-center"
            style="border: 1px solid #ea7c69; font-size: 18px"
            @click="createOrder"
          >
            <circle-progress v-if="loading" />
            Tạo order
          </button>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  watch,
  computed,
} from "@vue/runtime-core";
import Food from "@/components/Food.vue";
import Menu from "@/components/MenuCategory.vue";
import type { FoodDef } from "@/types/food.types";
import { useRoute } from "vue-router";
import { useCategoryStore } from "@/store/category";
import { storeToRefs } from "pinia";
import api from "@/plugins/api";
import CircleProgress from "@/components/atoms/CircleProgress.vue";
import Pagination from "@/components/atoms/Pagination.vue";
import { useOrderStore } from "@/store/order";
import FormInput from "@/components/atoms/FormInput.vue";
import { Form } from "vee-validate";
import { formatMoney } from "@/utils/formatMoney";

export default defineComponent({
  components: {
    Food,
    Menu,
    CircleProgress,
    Pagination,
    FormInput,
    Form,
  },
  setup() {
    const listFood = ref<FoodDef[]>([]);
    const route = useRoute();
    const type = ref("Đồ ăn");
    const page = ref(1);
    const keySearch = ref("")

    // loading
    const isLoading = ref(false);
    const isShow = ref(false);
    // category store
    const categoryStore = useCategoryStore();
    const { categories } = storeToRefs(categoryStore);
    // order store
    const orderStore = useOrderStore();
    const { listOrders, reset } = orderStore;
    const totalPrice = computed(() => {
      let total = 0;
      listOrders.orderDetails.forEach((order) => {
        total += order.menu.price * order.amount;
      });
      return total;
    });

    //pagination
    const pagination = reactive({
      currentPage: 1,
      totalPage: 1,
    });

    watch(
      () => route.path,
      () => {
        callApi();
      }
    );
    watch(
      () => route.params,
      () => {
        callApi();
      }
    );
    watch(
      () => keySearch.value,
      () => {
        callApi();
      }
    );
    onMounted(() => {
      callApi();
    });
    const callApi = async () => {
      isLoading.value = true;
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      page.value = Number(searchParams.get("page"));
      if (route.path === "/") {
        type.value = "Đồ ăn";
      } else if (categories.value.length > 1) {
        type.value =
          categories.value.find(
            (category) => category.categoryId === route.path.slice(1)
          )?.categoryName ?? "";
      }
      const result = await api.get(
        `/Menu/paging?categoryName=${encodeURI(
          type.value
        )}&keySearch=${keySearch.value}&PageSize=10&PageNumber=${page.value}`
      );
      if (result) {
        listFood.value = result.data.data;
        pagination.currentPage = result.data.pagination.pageNumber;
        pagination.totalPage = result.data.pagination.totalPage;
      }
      isLoading.value = false;
    };
    const closeModal = () => {
      isShow.value = false;
    };
    const openModal = () => {
      isShow.value = true;
    };
    return {
      listFood,
      isLoading,
      pagination,
      isShow,
      closeModal,
      openModal,
      listOrders,
      totalPrice,
      reset,
      keySearch,
    };
  },
  data() {
    return {
      loading: false,
    };
  },
  watch: {},
  methods: {
    formatMoney,
    async createOrder() {
      if (this.listOrders.tableNumber != "") {
        this.loading = true;
        const details = this.listOrders.orderDetails.map((item) => {
          return {
            menuId: item.menuId,
            amount: item.amount,
            note: item.note,
          };
        });
        const result = await api.post("/order", {
          tableNumber: this.listOrders.tableNumber,
          orderDetails: details,
        });
        if (result) {
          this.listOrders.orderDetails = [];
        }
        this.closeModal();
        this.loading = false;
      }
    },
    deleteOrder(index: number) {
      this.listOrders.orderDetails.splice(index, 1);
    },
    submit() {},
  },
});
</script>

<style lang="scss" scoped>
.home-header {
  display: flex;
  justify-content: space-between;
}
.div-loading {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}
</style>
