import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const products = await prisma.product.findMany();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PlayStation Cards</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="mt-2 w-full"
            />
            <Link
              href={`/product/${product.id}`}
              className="mt-2 inline-block bg-blue-500 text-white p-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
