import { defineStore } from "pinia";
import { reactive } from "vue";
import api from "@/plugins/api";

export const useOrderStore = defineStore("order", () => {
  const listOrders = reactive({
    tableNumber: "",
    orderDetails: [] as any,
  });
  function addOrder(menu: any, amount: number) {
    listOrders.orderDetails.push({
      menuId: menu.menuId,
      amount,
      menu,
      note: "",
    });
    listOrders.orderDetails.push();
  }
  function createOrder() {
    return api.post("/api/order", listOrders);
  }
  function reset() {
    listOrders.tableNumber = "";
    listOrders.orderDetails = [];
  }
  return {
    listOrders,
    addOrder,
    createOrder,
    reset,
  };
});
