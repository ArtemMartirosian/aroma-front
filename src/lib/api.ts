import axios from "axios";
import { Brand, Category, DashboardStats, Product, ProductVariant, ProductsResponse } from "@/types/catalog";
import {
  getMockBrands,
  getMockCategories,
  getMockProductBySlug,
  getMockProductsResponse,
} from "@/lib/mock-catalog";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const ADMIN_TOKEN_STORAGE_KEY = "aroma_admin_token";

export const api = axios.create({
  baseURL: API_URL,
});

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const responseMessage = error.response?.data;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (
    responseMessage &&
    typeof responseMessage === "object" &&
    "message" in responseMessage
  ) {
    const message = responseMessage.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message) && message.length) {
      return message.join(", ");
    }
  }

  return fallback;
}

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const hasAuthorizationHeader = Boolean(config.headers?.Authorization);
  if (hasAuthorizationHeader) {
    return config;
  }

  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  if (!token) {
    return config;
  }

  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function loginAdmin(email: string, password: string) {
  const { data } = await api.post<{ accessToken: string; user: unknown }>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function getProducts(params?: Record<string, string | number | undefined>) {
  try {
    const { data } = await api.get<ProductsResponse>("/products", { params });
    return data;
  } catch {
    const limit = Number(params?.limit ?? 100);
    return getMockProductsResponse(Number.isFinite(limit) ? limit : 100);
  }
}

export async function getProduct(slug: string) {
  try {
    const { data } = await api.get<Product>(`/products/${slug}`);
    return data;
  } catch {
    const fallbackProduct = getMockProductBySlug(slug);
    if (!fallbackProduct) {
      throw new Error("Product not found");
    }
    return fallbackProduct;
  }
}

export async function getBrands() {
  try {
    const { data } = await api.get<Brand[]>("/brands");
    return data;
  } catch {
    return getMockBrands();
  }
}

export async function getCategories() {
  try {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  } catch {
    return getMockCategories();
  }
}

export async function getAdminDashboard() {
  const { data } = await api.get<DashboardStats>("/admin/dashboard");
  return data;
}

export async function getAdminProducts() {
  const { data } = await api.get<ProductsResponse>("/admin/products", {
    params: { limit: 100 },
  });
  return data;
}

export async function getAdminProduct(id: string) {
  const { data } = await api.get<Product>(`/admin/products/${id}`);
  return data;
}

type ProductSavePayload = Partial<Omit<Product, "variants">> & {
  variants?: Array<Partial<ProductVariant> & Pick<ProductVariant, "volume" | "price">>;
};

export async function saveProduct(payload: ProductSavePayload, id?: string) {
  const { data } = id
    ? await api.patch<Product>(`/admin/products/${id}`, payload)
    : await api.post<Product>("/admin/products", payload);
  return data;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<{ url: string; filename: string }>(
    "/admin/products/upload-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/admin/products/${id}`);
}

export async function getAdminBrands() {
  const { data } = await api.get<Brand[]>("/admin/brands");
  return data;
}

export async function getAdminCategories() {
  const { data } = await api.get<Category[]>("/admin/categories");
  return data;
}

export async function saveBrand(payload: Partial<Brand>, id?: string) {
  const { data } = id
    ? await api.patch<Brand>(`/admin/brands/${id}`, payload)
    : await api.post<Brand>("/admin/brands", payload);
  return data;
}

export async function deleteBrand(id: string) {
  await api.delete(`/admin/brands/${id}`);
}

export async function saveCategory(payload: Partial<Category>, id?: string) {
  const { data } = id
    ? await api.patch<Category>(`/admin/categories/${id}`, payload)
    : await api.post<Category>("/admin/categories", payload);
  return data;
}

export async function deleteCategory(id: string) {
  await api.delete(`/admin/categories/${id}`);
}
