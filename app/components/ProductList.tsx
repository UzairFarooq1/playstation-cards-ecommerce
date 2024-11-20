"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/app/types";

interface ProductListProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

type SortKey = keyof Product;

export function ProductList({ products, onProductsChange }: ProductListProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "name",
    direction: "asc",
  });
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortConfig]);

  const filterAndSortProducts = () => {
    const sortedProducts = [...products].sort((a, b) => {
      if (sortConfig.key === "price") {
        return sortConfig.direction === "asc"
          ? a.price - b.price
          : b.price - a.price;
      } else {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined)
          return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue === undefined)
          return sortConfig.direction === "asc" ? -1 : 1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setFilteredProducts(sortedProducts);
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      const res = await fetch(`/api/products/${deleteProductId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      const updatedProducts = products.filter(
        (product) => product.id !== deleteProductId
      );
      onProductsChange(updatedProducts);
      setFilteredProducts(updatedProducts);
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete product.",
        variant: "destructive",
      });
    } finally {
      setDeleteProductId(null);
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/admin/edit-product/${productId}`);
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => handleSort("name")}
          className="flex items-center gap-2"
        >
          Name
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSort("price")}
          className="flex items-center gap-2"
        >
          Price
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-contain mb-4 rounded"
              />
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-semibold mb-4">
                Ksh.{product.price.toFixed(2)}
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteProductId(product.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
