export type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    category: string | null;
    stockQuantity: number;
    sku: string;
    createdAt: Date;
    updatedAt: Date;
  };