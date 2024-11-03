import Link from "next/link";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function Products() {
  const featuredProducts = await prisma.product.findMany({
    take: 3,
  });

  return (
    <div className="container mx-auto p-4">
      {/* Featured Products */}
      <section id="featured-products" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <Button asChild>
                <Link href={`/product/${product.id}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
