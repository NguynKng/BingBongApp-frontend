import { create } from "zustand";
import useAuthStore from "./authStore";
import { toast } from "react-hot-toast";
import { cartAPI } from "../services/api";

const useCartStore = create((set, get) => ({
  cart: {},
  loading: false,
  setCart: (cart) => set({ cart }),
  addToCart: async (productId, variantId) => {
    if (!useAuthStore.getState().user) {
      return;
    }
    try {
      const res = await cartAPI.addToCart(productId, variantId);
      if (res.success) {
        set({ cart: res.data });
        toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
      } else {
        toast.error("Thêm sản phẩm vào giỏ hàng thất bại!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  },
  minusFromCart: async (productId, variantId) => {
    if (!useAuthStore.getState().user) {
      return;
    }
    try {
      const res = await cartAPI.minusFromCart(productId, variantId);
      if (res.success) {
        set({ cart: res.data });
        toast.success("Giảm số lượng sản phẩm trong giỏ hàng thành công!");
      } else {
        toast.error("Giảm số lượng sản phẩm trong giỏ hàng thất bại!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  },
  removeFromCart: async (productId, variantId) => {
    if (!useAuthStore.getState().user) {
      return;
    }
    try {
      const res = await cartAPI.removeFromCart(productId, variantId);
      if (res.success) {
        set({ cart: res.data });
        toast.success("Bỏ sản phẩm khỏi giỏ hàng thành công!");
      } else {
        toast.error("Bỏ sản phẩm khỏi giỏ hàng thất bại!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  },
  clearCart: async () => {
    if (!useAuthStore.getState().user) {
      return;
    }
    try {
      const res = await cartAPI.clearCart();
      if (res.success) {
        set({ cart: {} });
      } else {
        toast.error("Dọn giỏ hàng thất bại!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  },
}));

export default useCartStore;
