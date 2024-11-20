import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/app/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface RecentOrdersProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export function RecentOrders({ orders, isLoading, error }: RecentOrdersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.user.name || order.user.email}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Ksh.{order.total.toFixed(2)}</p>
                <Badge
                  variant={
                    order.status === "COMPLETED" ? "default" : "secondary"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/admin/orders">
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
