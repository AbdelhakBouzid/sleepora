import { useCallback, useEffect, useState } from "react";

const STORAGE_EVENT = "sleepora:local-storage-sync";

function readValue(key, initialValue) {
  if (typeof window === "undefined") return initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initialValue;
  } catch (_error) {
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    function handleStorage(event) {
      if (event.key !== key) return;
      setValue(readValue(key, initialValue));
    }

    function handleCustomStorage(event) {
      const detail = event.detail || {};
      if (detail.key !== key) return;
      setValue(readValue(key, initialValue));
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(STORAGE_EVENT, handleCustomStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleCustomStorage);
    };
  }, [initialValue, key]);

  const setStoredValue = useCallback(
    (nextValue) => {
      setValue((current) => {
        const resolved = typeof nextValue === "function" ? nextValue(current) : nextValue;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
            window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
          } catch (_error) {
            // Ignore storage write failures.
          }
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}
