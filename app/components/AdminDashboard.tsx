"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StatisticsOverview } from "./StatisticsOverview";
import { ChartsSection } from "./ChartsSection";
import { ProductList } from "./ProductList";
import { Product, Order, SalesData, CategoryData } from "@/app/types";
import { RecentOrders } from "./RecentOrders";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchSalesData();
    fetchCategoryData();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      setRecentOrders(data.slice(0, 5));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchSalesData = async () => {
    try {
      const res = await fetch("/api/sales");
      if (!res.ok) throw new Error("Failed to fetch sales data");
      const data: SalesData[] = await res.json();
      setSalesData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sales data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch category data");
      const data: CategoryData[] = await res.json();
      setCategoryData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch category data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/add-product">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      <StatisticsOverview products={products} recentOrders={recentOrders} />
      <ChartsSection salesData={salesData} categoryData={categoryData} />
      <RecentOrders orders={recentOrders} />
      <ProductList products={products} onProductsChange={setProducts} />
    </div>
  );
}
