import { useEffect, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

function buildCartEntryId(productId, productSnapshot = null) {
  const baseId = String(productSnapshot?.id || productId || "").trim();
  const selectedColor = String(productSnapshot?.selectedColor || "").trim().toLowerCase();
  const selectedSize = String(productSnapshot?.selectedSize || "").trim().toLowerCase();
  const variantSuffix = [selectedSize || "_", selectedColor || "_"].join("::");
  return `${baseId}::${variantSuffix}`;
}

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

function normalizeCartState(cart) {
  const entries = cart && typeof cart === "object" ? Object.entries(cart) : [];
  const next = {};

  for (const [rawKey, rawEntry] of entries) {
    const normalized = normalizeCartEntry(rawEntry);
    const snapshot = normalized.product;
    const normalizedKey = buildCartEntryId(String(snapshot?.id || rawKey).split("::")[0], snapshot);
    const current = normalizeCartEntry(next[normalizedKey]);
    next[normalizedKey] = {
      quantity: current.quantity + normalized.quantity,
      product: snapshot || current.product || null
    };
  }

  return next;
}

export default function useCart(storageKey) {
  const [cart, setCart] = useLocalStorage(storageKey, {});
  const normalizedCart = useMemo(() => normalizeCartState(cart), [cart]);

  const count = useMemo(
    () => Object.values(normalizedCart).reduce((sum, entry) => sum + normalizeCartEntry(entry).quantity, 0),
    [normalizedCart]
  );

  useEffect(() => {
    const raw = JSON.stringify(cart || {});
    const normalized = JSON.stringify(normalizedCart || {});
    if (raw !== normalized) {
      setCart(normalizedCart);
    }
  }, [cart, normalizedCart, setCart]);

  function addItem(productId, productSnapshot = null) {
    const id = buildCartEntryId(productId, productSnapshot);
    setCart((prev) => {
      const next = { ...normalizeCartState(prev) };
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
      const next = { ...normalizeCartState(prev) };
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
      const next = { ...normalizeCartState(prev) };
      delete next[id];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  return { cart: normalizedCart, count, setCart, addItem, changeQty, removeItem, clearCart };
}
