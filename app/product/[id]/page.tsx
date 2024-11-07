import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/app/lib/prisma";
import RelatedProducts from "@/app/components/RelatedProducts";
import AddToCartButton from "@/app/components/AddToCartButton";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { id: true } });
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
    },
    take: 3,
  });

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Home
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[450px]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-lg shadow-lg object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <div className="mb-4">
            <span className="font-semibold">Availability: </span>
            {product.stockQuantity > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Category: </span>
            {product.category}
          </div>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
