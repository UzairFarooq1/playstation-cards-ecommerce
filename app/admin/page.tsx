"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { Product, Order, SalesData, CategoryData } from "@/app/types";
import { useSession } from "next-auth/react";
import { StatisticsOverview } from "../components/StatisticsOverview";
import { ChartsSection } from "../components/ChartsSection";
import { RecentOrders } from "../components/RecentOrders";
import { redirect } from "next/navigation";
import { ProductList } from "../components/ProductList";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          productsResponse,
          ordersResponse,
          salesResponse,
          categoriesResponse,
          userCountResponse,
        ] = await Promise.all([
          fetch("/api/products?limit=3"),
          fetch("/api/orders?limit=5"),
          fetch("/api/sales"),
          fetch("/api/categories"),
          fetch("/api/users/count"),
        ]);

        const responses = [
          productsResponse,
          ordersResponse,
          salesResponse,
          categoriesResponse,
          userCountResponse,
        ];

        for (const response of responses) {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `${response.url}: ${errorData.error || response.statusText}`
            );
          }
        }

        const [
          productsData,
          ordersData,
          salesData,
          categoriesData,
          userCountData,
        ] = await Promise.all(responses.map((r) => r.json()));

        setProducts(productsData);
        setRecentOrders(ordersData.orders);
        setSalesData(salesData);
        setCategoryData(categoriesData);
        setUserCount(userCountData.totalUsers);
      } catch (error) {
        setError(`Failed to fetch data:`);
        toast({
          title: "Error",
          description: `Failed to fetch data:`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center opacity-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    console.log(
      "AdminDashboard - Access denied. Session:",
      JSON.stringify(session, null, 2)
    );
    redirect("/unauthorized");
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <p>Welcome, {session.user.name || session.user.email}</p>
          </div>
          <Link href="/admin/add-product">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <StatisticsOverview
        products={products}
        recentOrders={recentOrders}
        salesData={salesData}
        categoryData={categoryData}
        userCount={userCount}
      />
      <ChartsSection salesData={salesData} categoryData={categoryData} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <RecentOrders
          orders={recentOrders}
          isLoading={isLoading}
          error={error}
        />

        {/* Product List with View All Button */}
        <div>
          <ProductList
            products={products.slice(0, 3)} // Show only the first three products
            onProductsChange={setProducts}
          />
          <div className="mt-4 flex justify-center">
            <Link href="/admin/products">
              <Button variant="outline" className="w-full md:w-auto">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
