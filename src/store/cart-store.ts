import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const safeQuantity =
          Number.isFinite(item.quantity) && item.quantity > 0
            ? item.quantity
            : 1;
        const existing = get().items.find(
          (cartItem) => cartItem.id === item.id,
        );
        if (existing) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.id === item.id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + safeQuantity,
                  }
                : cartItem,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: safeQuantity }] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      updateQuantity: (id, quantity) => {
        const safeQuantity =
          Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: safeQuantity } : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "epf-cart",
      merge: (persistedState, currentState) => {
        const merged = {
          ...currentState,
          ...(persistedState as Partial<CartState>),
        };
        const items = Array.isArray(merged.items) ? merged.items : [];
        return {
          ...merged,
          items: items.map((item) => ({
            ...item,
            quantity:
              Number.isFinite(item.quantity) && item.quantity > 0
                ? item.quantity
                : 1,
          })),
        };
      },
    },
  ),
);

