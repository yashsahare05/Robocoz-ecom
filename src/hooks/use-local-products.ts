"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import {
  getLocalProducts,
  LOCAL_PRODUCTS_EVENT,
  LOCAL_PRODUCTS_KEY,
} from "@/lib/local-products";

export const useLocalProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setProducts(getLocalProducts());
    sync();
    setReady(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCAL_PRODUCTS_KEY) {
        sync();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOCAL_PRODUCTS_EVENT, sync as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOCAL_PRODUCTS_EVENT, sync as EventListener);
    };
  }, []);

  return { products, ready };
};
