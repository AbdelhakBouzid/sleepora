import { useCallback, useEffect, useState } from "react";
import { readStorageValue, STORAGE_SYNC_EVENT, writeStorageValue } from "../lib/storage";

function readValue(key, initialValue) {
  return readStorageValue(key, initialValue);
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
    window.addEventListener(STORAGE_SYNC_EVENT, handleCustomStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORAGE_SYNC_EVENT, handleCustomStorage);
    };
  }, [initialValue, key]);

  const setStoredValue = useCallback(
    (nextValue) => {
      setValue((current) => {
        const resolved = typeof nextValue === "function" ? nextValue(current) : nextValue;
        writeStorageValue(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}
