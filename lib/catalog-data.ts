import "server-only";
import { cache } from "react";
import { getAllProducts, getCategories } from "./easytrade";

// Request-scoped reuse only: fresh checkout reads still bypass this layer.
export const getCatalogProducts = cache(() => getAllProducts());
export const getCatalogCategories = cache(() => getCategories());
