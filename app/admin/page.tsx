"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Product, Order, SalesData, CategoryData } from "@/app/types";
import { useSession } from "next-auth/react";
import { StatisticsOverview } from "../components/StatisticsOverview";
import { ChartsSection } from "../components/ChartsSection";
import { ProductList } from "../components/ProductList";
import { RecentOrders } from "../components/RecentOrders";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productsResponse,
          ordersResponse,
          salesResponse,
          categoriesResponse,
        ] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
          fetch("/api/sales"),
          fetch("/api/categories"),
        ]);

        if (
          !productsResponse.ok ||
          !ordersResponse.ok ||
          !salesResponse.ok ||
          !categoriesResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [productsData, ordersData, salesData, categoriesData] =
          await Promise.all([
            productsResponse.json(),
            ordersResponse.json(),
            salesResponse.json(),
            categoriesResponse.json(),
          ]);

        setProducts(productsData);
        setRecentOrders(ordersData.slice(0, 5));
        setSalesData(salesData);
        setCategoryData(categoriesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  if (!session) {
    const currentUser = {
      email: "uzairf2580@gmail.com",
      role: "ADMIN",
    };

    if (!currentUser || currentUser.role !== "ADMIN") {
      console.log(
        `AdminPage - Access denied. User email: ${currentUser?.email}, role: ${currentUser?.role}`
      );
      redirect("/unauthorized");
    }
    console.log(
      "AdminDashboard - Access denied. Session:",
      JSON.stringify(session, null, 2)
    );
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <p>Welcome, {session.user.name || session.user.email}</p>
          <Link href="/admin/add-product">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      <StatisticsOverview products={products} recentOrders={recentOrders} />
      <ChartsSection salesData={salesData} categoryData={categoryData} />
      <RecentOrders orders={recentOrders} />
      <ProductList products={products} onProductsChange={setProducts} />
    </div>
  );
}
