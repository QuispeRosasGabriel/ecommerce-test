import { ISelectedProduct } from "./ISelectedProduct";

export interface ICheckout {
  products: ISelectedProduct[];
  total: number;
}
