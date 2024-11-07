"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/prisma";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch the product data
  useEffect(() => {
    const fetchProduct = async () => {
      const product = await prisma.product.findUnique({
        where: {
          id,
        },
      });
      setProduct(product);
      setName(product?.name || "");
      setDescription(product?.description || "");
      setPrice(product?.price || 0);
      setImageUrl(product?.imageUrl || "");
    };
    fetchProduct();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await prisma.product.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          price,
          imageUrl,
        },
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block font-medium mb-1">
                Price
              </label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block font-medium mb-1">
                Image URL
              </label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
