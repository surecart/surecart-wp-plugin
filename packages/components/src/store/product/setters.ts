import { ProductState } from "src/types";
import state from "./store";

/**
 * Set the product
 *
 * @param {string} productId - Product ID
 * @param {Partial<ProductState>} product - Product object
 *
 * @returns {void}
 */
export const setProduct = (productId:string, product:Partial<ProductState>):void =>{
  if(!productId || !state[productId]) return;

  Object.keys(product).forEach(key => {
    state[productId][key] = product[key];
  });
}
