import type { FoodDef } from "./food.types";

export type OrderResponseDef = {
  orderId: string;
  tableNumber: number;
  totalPrice: number;
  status: number;
  createdTime: string;
  statusName: string;
  menu: FoodDef | null;
};
export type OrderDef = {
  amount: number;
  price: number;
  orderId: number;
  orderDetailId: string;
};
export type OrderStore = {
  tableNumber: number;
  orderDetails: Order[] | [];
};

export type Order = {
  menuId: string;
  amount: number;
  menu: FoodDef | null;
};
