"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    stockQuantity: "",
    sku: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? parseFloat(value) || ""
          : value,
    }));
  };

  const generateSKU = () => {
    const prefix = newProduct.category
      ? newProduct.category.substring(0, 3).toUpperCase()
      : "PRD";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    setNewProduct((prev) => ({
      ...prev,
      sku: `${prefix}-${timestamp}-${random}`,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!newProduct.name.trim()) errors.push("Product name is required");
    if (!newProduct.description.trim()) errors.push("Description is required");
    if (!newProduct.price || parseFloat(newProduct.price) <= 0)
      errors.push("Valid price is required");
    if (!newProduct.imageUrl.trim()) errors.push("Image URL is required");
    if (!newProduct.stockQuantity || parseFloat(newProduct.stockQuantity) < 0)
      errors.push("Valid stock quantity is required");
    if (!newProduct.sku.trim()) errors.push("SKU is required");

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(". "),
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsLoading(true);
    console.log("Sending product data:", newProduct);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add product");
      }

      const addedProduct = await res.json();
      console.log("Product added successfully:", addedProduct);

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      router.push("/admin");
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={newProduct.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                placeholder="Enter product category"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-grow">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={newProduct.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="outline" onClick={generateSKU}>
                  Generate SKU
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={newProduct.imageUrl}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                required
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-grow">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
              <Link href="/admin">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
