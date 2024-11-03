"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [deleteProductId, setDeleteProductId] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [products]);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, priceFilter, sortConfig, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, product) => sum + product.price,
      0
    );
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    const prices = products.map((product) => product.price);
    const lowestPrice = Math.min(...prices, 0);
    const highestPrice = Math.max(...prices, 0);

    setStats({
      totalProducts,
      totalValue,
      averagePrice,
      lowestPrice,
      highestPrice,
    });
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    switch (priceFilter) {
      case "low":
        filtered = filtered.filter(
          (product) => product.price < stats.averagePrice
        );
        break;
      case "high":
        filtered = filtered.filter(
          (product) => product.price >= stats.averagePrice
        );
        break;
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortConfig.key === "price") {
        comparison = a.price - b.price;
      } else {
        comparison = a[sortConfig.key].localeCompare(b[sortConfig.key]);
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    setFilteredProducts(filtered);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      const res = await fetch(`/api/products/${deleteProductId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProducts((prev) =>
        prev.filter((product) => product.id !== deleteProductId)
      );
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteProductId(null);
    }
  };

  const handleEdit = (productId) => {
    router.push(`/admin/edit-product/${productId}`);
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">
              Total Products
            </h3>
            <p className="text-2xl font-bold mt-2">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
            <p className="text-2xl font-bold mt-2">
              ${stats.totalValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Average Price</h3>
            <p className="text-2xl font-bold mt-2">
              ${stats.averagePrice.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Lowest Price</h3>
            <p className="text-2xl font-bold mt-2">
              ${stats.lowestPrice.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Highest Price</h3>
            <p className="text-2xl font-bold mt-2">
              ${stats.highestPrice.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="low">Below Average</SelectItem>
            <SelectItem value="high">Above Average</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSort("name")}
            className="flex items-center gap-2"
          >
            Name
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSort("price")}
            className="flex items-center gap-2"
          >
            Price
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-lg font-semibold mb-4">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteProductId(product.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
