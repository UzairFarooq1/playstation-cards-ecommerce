import { Card, CardContent } from "@/components/ui/card";
import { Product, Order, SalesData, CategoryData } from "@/app/types";

interface StatisticsOverviewProps {
  products: Product[];
  recentOrders: Order[];
  salesData: SalesData[];
  categoryData: CategoryData[];
  userCount: number;
}

export function StatisticsOverview({
  products = [],
  recentOrders = [],
  salesData = [],
  categoryData = [],
  userCount = 0,
}: StatisticsOverviewProps) {
  console.log("StatisticsOverview - Received data:", {
    products: products.length,
    recentOrders: recentOrders.length,
    salesData: salesData.length,
    categoryData: categoryData.length,
    userCount,
  });

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + product.price, 0),
    totalOrders: recentOrders.length,
    totalRevenue: recentOrders.reduce((sum, order) => sum + order.total, 0),
    averagePrice:
      products.length > 0
        ? products.reduce((sum, product) => sum + product.price, 0) /
          products.length
        : 0,
    averageOrderValue:
      recentOrders.length > 0
        ? recentOrders.reduce((sum, order) => sum + order.total, 0) /
          recentOrders.length
        : 0,
    totalCategories: categoryData.length,
    totalSales: salesData.reduce((sum, data) => sum + data.sales, 0),
    totalUsers: userCount,
  };

  console.log("StatisticsOverview - Calculated stats:", stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalProducts}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">
            ${stats.totalRevenue.toFixed(2)}
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
          <h3 className="text-sm font-medium text-gray-500">
            Average Order Value
          </h3>
          <p className="text-2xl font-bold mt-2">
            ${stats.averageOrderValue.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Total Categories
          </h3>
          <p className="text-2xl font-bold mt-2">{stats.totalCategories}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
        </CardContent>
      </Card>
    </div>
  );
}
