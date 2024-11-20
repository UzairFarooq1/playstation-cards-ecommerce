"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { StatisticsOverview } from "./StatisticsOverview";
import { ChartsSection } from "./ChartsSection";
import { Product, Order, SalesData, CategoryData } from "@/app/types";
import { RecentOrders } from "./RecentOrders";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductList } from "./ProductList";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchSalesData(),
        fetchCategoryData(),
        fetchUserCount(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const data: Product[] = await res.json();
    setProducts(data);
    console.log("Fetched products:", data);
  };

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data: Order[] = await res.json();
    setRecentOrders(data.slice(0, 5));
    console.log("Fetched orders:", data);
  };

  const fetchSalesData = async () => {
    const res = await fetch("/api/sales");
    if (!res.ok) throw new Error("Failed to fetch sales data");
    const data: SalesData[] = await res.json();
    setSalesData(data);
    console.log("Fetched sales data:", data);
  };

  const fetchCategoryData = async () => {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Failed to fetch category data");
    const data: CategoryData[] = await res.json();
    setCategoryData(data);
    console.log("Fetched category data:", data);
  };

  const fetchUserCount = async () => {
    const res = await fetch("/api/users/count");
    if (!res.ok) throw new Error("Failed to fetch user count");
    const data = await res.json();
    setUserCount(data.totalUsers);
    console.log("Fetched user count:", data.totalUsers);
  };

  if (status === "loading") {
    return <Skeleton className="w-full h-screen" />;
  }

  if (
    !session ||
    !session.user ||
    session.user.email !== "uzairf2580@gmail.com" ||
    session.user.role !== "ADMIN"
  ) {
    console.log(
      "AdminDashboard - Access denied. Session:",
      JSON.stringify(session, null, 2)
    );
    return <div className="text-center text-2xl mt-8">Access Denied</div>;
  }

  console.log("AdminDashboard - Access granted. User:", session.user);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <p>Welcome, {session.user.name || session.user.email}</p>
          <Button onClick={fetchAllData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Link href="/admin/add-product">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-[200px]" />
      ) : (
        <>
          <StatisticsOverview
            products={products}
            recentOrders={recentOrders}
            categoryData={categoryData}
            salesData={salesData}
            userCount={userCount}
          />
          <ChartsSection salesData={salesData} categoryData={categoryData} />
          <ProductList products={products} onProductsChange={setProducts} />
        </>
      )}
    </div>
  );
}
