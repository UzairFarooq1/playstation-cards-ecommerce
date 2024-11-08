import Link from "next/link";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Products() {
  const featuredProducts = await prisma.product.findMany({});

  return (
    <div className="container mx-auto p-4">
      {/* Featured Products */}
      <section id="featured-products" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg">
              <Image
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                fill
                className="rounded-lg shadow-lg object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
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
