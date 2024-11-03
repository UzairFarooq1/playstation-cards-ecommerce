// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
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
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
