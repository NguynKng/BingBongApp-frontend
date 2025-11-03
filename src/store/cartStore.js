import { create } from "zustand";
import useAuthStore from "./authStore";
import { toast } from "react-hot-toast";
import { cartAPI } from "../services/api";

const useCartStore = create((set, get) => ({
  cart: {},
  loading: false,
  getUserCart: async () => {
    if (!useAuthStore.getState().user) {
      return;
    }
    if (get().cart?._id) return;
    try {
      set({ loading: true });
      const res = await cartAPI.getUserCart();
      if (res.success) {
        set({ cart: res.data });
      } else {
        toast.error("Lấy giỏ hàng thất bại!");
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      set({ loading: false });
    }
  },
  addToCart: async (productId, variantId) => {
    if (!useAuthStore.getState().user) {
      return;
    }
    try {
      const res = await cartAPI.addToCart(productId, variantId);
      console.log("addToCart -> res:", res);
      if (res.success) {
        set({ cart: [...get().cart, res.data] });
        toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
      } else {
        toast.error("Thêm sản phẩm vào giỏ hàng thất bại!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  },
  removeFromCart: async (productId) => {
    if (!useAuthStore.getState().user) {
      return;
    }
    try {
      const res = await cartAPI.removeFromCart(productId);
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
        toast.success("Dọn giỏ hàng thành công!");
      } else {
        toast.error("Dọn giỏ hàng thất bại!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  },
}));

export default useCartStore;
