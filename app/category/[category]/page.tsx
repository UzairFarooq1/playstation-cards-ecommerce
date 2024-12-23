import { GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/prisma";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

// Define the page props type
export interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

// Fetch products by category
async function fetchProductsByCategory(category: string) {
  return await prisma.product.findMany({
    where: {
      category: {
        equals: category,
        mode: "insensitive",
      },
    },
  });
}

// Define the page component
export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const { category } = params;
  const products = await fetchProductsByCategory(category);

  return (
    <div className="container mx-auto p-4 space-y-12">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {category.charAt(0).toUpperCase() + category.slice(1)} Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Link href={`/product/${product.id}`} passHref>
                <Image
                  src={
                    product.imageUrl || "/placeholder.svg?height=400&width=400"
                  }
                  alt={product.name}
                  width={300}
                  height={300}
                  className="mx-auto mb-4 rounded-lg h-[200px] object-contain"
                />
              </Link>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-2xl font-bold text-primary mb-4">
                Ksh.{product.price.toFixed(2)}
              </p>
              <Button asChild>
                <Link href={`/product/${product.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
