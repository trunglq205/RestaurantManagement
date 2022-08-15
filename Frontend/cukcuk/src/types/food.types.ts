import type { CategoryDef } from "./category.type";
export interface FoodDef {
  menuId: string;
  menuName: string;
  price: number;
  unit?: string;
  image: string;
  description?: string;
  category?: CategoryDef;
}
