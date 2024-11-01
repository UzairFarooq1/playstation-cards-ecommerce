"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ... rest of the component code

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
  });
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
    } else {
      fetchProducts();
    }
  }, [session, router]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    setNewProduct({ name: "", description: "", price: 0, imageUrl: "" });
    fetchProducts();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="imageUrl"
          value={newProduct.imageUrl}
          onChange={handleInputChange}
          placeholder="Image URL"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Product
        </button>
      </form>
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
          </div>
        ))}
      </div>
    </div>
  );
}
