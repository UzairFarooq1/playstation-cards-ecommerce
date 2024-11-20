export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  stockQuantity: number;
  sku: string;
}

export interface Order {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

export interface SalesData {
  date: string;
  sales: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

// app/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}