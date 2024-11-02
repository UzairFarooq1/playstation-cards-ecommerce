import Link from "next/link";
import { Product } from "@prisma/client";

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
            <Link
              href={`/product/${product.id}`}
              className="mt-2 inline-block text-blue-500 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
