import Link from "next/link";
import Image from "next/image";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "./lib/auth";
import { Input } from "@/components/ui/input";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log("Home - Session:", JSON.stringify(session, null, 2));

  const featuredProducts = await prisma.product.findMany({
    take: 3,
  });

  const categories = await prisma.product.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  const uniqueCategories = categories
    .map((c) => c.category)
    .filter((category): category is string => category !== null);

  return (
    <div className="container mx-auto p-4 space-y-12">
      {/* Hero Section */}
      <section className="relative h-[70vh] rounded-xl overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/29259392/pexels-photo-29259392/free-photo-of-black-and-white-gaming-equipment-on-wooden-surface.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="PlayStation Cards Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-8">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Welcome to PlayStation Cards
          </h1>
          <p className="text-2xl mb-8 text-white max-w-2xl">
            Discover the best deals on PlayStation gift cards and subscriptions!
          </p>
          <Button size="lg" asChild>
            <Link href="#featured-products">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow"
            >
              <Link href={`/product/${product.id}`} passHref>
                <Image
                  src={
                    product.imageUrl || "/placeholder.svg?height=400&width=400"
                  }
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-[300px] object-contain cursor-pointer"
                />
              </Link>
              <CardContent className="p-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <p className="text-gray-600 mb-4">
                  Ksh.{product.price.toFixed(2)}
                </p>
                <Button asChild>
                  <Link href={`/product/${product.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-100 rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {uniqueCategories.map((category) => (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Link
                  href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                >
                  {category}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Instant Delivery",
              description: "Get your codes instantly after purchase",
              icon: "⚡",
            },
            {
              title: "Secure Transactions",
              description: "Your payment information is always protected",
              icon: "🔒",
            },
            {
              title: "Best Prices",
              description: "We offer competitive prices on all our products",
              icon: "💰",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      {/* <section className="bg-primary text-primary-foreground rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 text-lg">
            Subscribe to our newsletter for exclusive deals and updates!
          </p>
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow"
              required
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </section> */}
    </div>
  );
}
