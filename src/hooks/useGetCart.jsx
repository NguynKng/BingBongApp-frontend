import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import { cartAPI } from "../services/api";

export const useGetCart = () => {
  const { user } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      // logout → reset
      setCart(null);
      setLoading(false);
      return;
    }

    // Nếu đã có cart nhưng là của user khác → fetch lại
    const isWrongUserCart =
      cart && cart.orderBy && cart.orderBy !== user._id;

    // Nếu cart đã có và đúng user → không fetch
    if (cart && cart._id && !isWrongUserCart) {
      setLoading(false);
      return;
    }

    // Fetch cart mới
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await cartAPI.getUserCart();
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching cart", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user?._id]); // chỉ chạy khi user.id đổi

  return { cart, loading };
};
