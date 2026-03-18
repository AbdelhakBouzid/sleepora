import { useEffect, useMemo } from "react";
import { clampCartQuantity, normalizeCartEntry } from "../lib/cart";
import useLocalStorage from "./useLocalStorage";

function buildCartEntryId(productId, productSnapshot = null) {
  const baseId = String(productSnapshot?.id || productId || "").trim();
  const selectedColor = String(productSnapshot?.selectedColor || "").trim().toLowerCase();
  const selectedSize = String(productSnapshot?.selectedSize || "").trim().toLowerCase();
  const variantSuffix = [selectedSize || "_", selectedColor || "_"].join("::");
  return `${baseId}::${variantSuffix}`;
}

function readExistingCartEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      quantity: clampCartQuantity(entry.quantity ?? entry.qty ?? 0, 0),
      product: entry.product && typeof entry.product === "object" ? entry.product : null
    };
  }

  return {
    quantity: clampCartQuantity(entry ?? 0, 0),
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
    const current = readExistingCartEntry(next[normalizedKey]);
    next[normalizedKey] = {
      quantity: clampCartQuantity(current.quantity + normalized.quantity, 1),
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

  function addItem(productId, productSnapshot = null, quantityToAdd = 1) {
    const id = buildCartEntryId(productId, productSnapshot);
    const delta = clampCartQuantity(quantityToAdd, 0);
    if (delta <= 0) return;

    setCart((prev) => {
      const next = { ...normalizeCartState(prev) };
      const current = readExistingCartEntry(next[id]);
      next[id] = {
        quantity: clampCartQuantity(current.quantity + delta, 1),
        product: productSnapshot || current.product || null
      };
      return next;
    });
  }

  function changeQty(productId, delta) {
    const id = String(productId);
    setCart((prev) => {
      const next = { ...normalizeCartState(prev) };
      const current = readExistingCartEntry(next[id]);
      const updated = current.quantity + Math.trunc(Number(delta || 0));
      if (updated <= 0) delete next[id];
      else {
        next[id] = {
          quantity: clampCartQuantity(updated, 1),
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
