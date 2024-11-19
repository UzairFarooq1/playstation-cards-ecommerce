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
import { ProductList } from "../components/ProductList";
import { RecentOrders } from "../components/RecentOrders";
import { redirect } from "next/navigation";

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
          fetch("/api/products"),
          fetch("/api/orders"),
          fetch("/api/sales"),
          fetch("/api/categories"),
          fetch("/api/users/count"),
        ]);

        if (
          !productsResponse.ok ||
          !ordersResponse.ok ||
          !salesResponse.ok ||
          !categoriesResponse.ok ||
          !userCountResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [
          productsData,
          ordersData,
          salesData,
          categoriesData,
          userCountData,
        ] = await Promise.all([
          productsResponse.json(),
          ordersResponse.json(),
          salesResponse.json(),
          categoriesResponse.json(),
          userCountResponse.json(),
        ]);

        setProducts(productsData);
        setRecentOrders(ordersData.slice(0, 5));
        setSalesData(salesData);
        setCategoryData(categoriesData);
        setUserCount(userCountData.totalUsers);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("Failed to fetch data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
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
            <p> Welcome, {session.user.name || session.user.email}</p>
          </div>
          <Link href="/admin/add-product">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center opacity-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <StatisticsOverview
            products={products}
            recentOrders={recentOrders}
            salesData={salesData}
            categoryData={categoryData}
            userCount={userCount}
          />
          <ChartsSection salesData={salesData} categoryData={categoryData} />
          <RecentOrders orders={recentOrders} />
          <ProductList products={products} onProductsChange={setProducts} />
        </>
      )}
    </div>
  );
}
