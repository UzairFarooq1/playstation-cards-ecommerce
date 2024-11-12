import { Card, CardContent } from "@/components/ui/card";
import { Product, Order } from "@/app/types";

interface StatisticsOverviewProps {
  products: Product[];
  recentOrders: Order[];
}

export function StatisticsOverview({
  products,
  recentOrders,
}: StatisticsOverviewProps) {
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
  };

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
    </div>
  );
}
