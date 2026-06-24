import axios from "axios";
import { Brand, Category, DashboardStats, Product, ProductsResponse } from "@/types/catalog";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
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
  const { data } = await api.get<ProductsResponse>("/products", { params });
  return data;
}

export async function getProduct(slug: string) {
  const { data } = await api.get<Product>(`/products/${slug}`);
  return data;
}

export async function getBrands() {
  const { data } = await api.get<Brand[]>("/brands");
  return data;
}

export async function getCategories() {
  const { data } = await api.get<Category[]>("/categories");
  return data;
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

export async function saveProduct(payload: Partial<Product>, id?: string) {
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
