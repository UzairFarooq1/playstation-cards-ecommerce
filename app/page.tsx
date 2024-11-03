import Link from "next/link";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
export default async function Home() {
  const session = await getServerSession(authOptions);
  const featuredProducts = await prisma.product.findMany({
    take: 3,
  });
  console.log("Session:", session);

  return (
    <div className="container mx-auto p-4">
      {/* Hero Section */}
      <section className="bg-gray-100 rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to PlayStation Cards
        </h1>
        <p className="text-xl mb-4">
          Discover the best deals on PlayStation gift cards and subscriptions!
        </p>
        <Button asChild>
          <Link href="#featured-products">Shop Now</Link>
        </Button>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
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

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Gift Cards", "Subscriptions", "DLC", "Special Offers"].map(
            (category) => (
              <div
                key={category}
                className="bg-gray-200 p-4 rounded-lg text-center"
              >
                <Link
                  href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {category}
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Instant Delivery",
              description: "Get your codes instantly after purchase",
            },
            {
              title: "Secure Transactions",
              description: "Your payment information is always protected",
            },
            {
              title: "Best Prices",
              description: "We offer competitive prices on all our products",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-blue-500 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-4">
          Subscribe to our newsletter for exclusive deals and updates!
        </p>
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow p-2 rounded text-black"
            required
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </section>
    </div>
  );
}
