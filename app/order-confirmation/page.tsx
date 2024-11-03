// app/order-confirmation/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          throw new Error("Failed to fetch order");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      fetchOrder();
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">Loading order details...</div>
    );
  }

  if (!order) {
    return <div className="container mx-auto p-4">Order not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
        <p className="font-bold">Thank you for your order!</p>
        <p>Your order has been successfully placed and is being processed.</p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Order Details</h2>
        <p>Order ID: {order.id}</p>
        <p>Total: ${order.total.toFixed(2)}</p>
        <p>Status: {order.status}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Items</h2>
        <ul>
          {order.items.map((item: any) => (
            <li key={item.id} className="mb-2">
              {item.product.name} x {item.quantity} - $
              {(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Shipping Address</h2>
        <p>{order.shippingAddress}</p>
      </div>
      <Button asChild>
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  );
}
