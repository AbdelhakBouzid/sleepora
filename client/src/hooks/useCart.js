import { useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

function normalizeCartEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      quantity: Math.max(1, Number(entry.quantity || entry.qty || 1)),
      product: entry.product && typeof entry.product === "object" ? entry.product : null
    };
  }

  return {
    quantity: Math.max(1, Number(entry || 1)),
    product: null
  };
}

export default function useCart(storageKey) {
  const [cart, setCart] = useLocalStorage(storageKey, {});

  const count = useMemo(
    () => Object.values(cart).reduce((sum, entry) => sum + normalizeCartEntry(entry).quantity, 0),
    [cart]
  );

  function addItem(productId, productSnapshot = null) {
    const id = String(productId);
    setCart((prev) => {
      const next = { ...prev };
      const current = normalizeCartEntry(next[id]);
      next[id] = {
        quantity: current.quantity + 1,
        product: productSnapshot || current.product || null
      };
      return next;
    });
  }

  function changeQty(productId, delta) {
    const id = String(productId);
    setCart((prev) => {
      const next = { ...prev };
      const current = normalizeCartEntry(next[id]);
      const updated = current.quantity + Number(delta || 0);
      if (updated <= 0) delete next[id];
      else {
        next[id] = {
          quantity: updated,
          product: current.product || null
        };
      }
      return next;
    });
  }

  function removeItem(productId) {
    const id = String(productId);
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  return { cart, count, setCart, addItem, changeQty, removeItem, clearCart };
}
