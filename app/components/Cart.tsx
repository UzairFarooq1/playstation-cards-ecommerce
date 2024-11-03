// app/components/Cart.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import CartItem from "./CartItem";

export default async function Cart() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Please sign in to view your cart</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return null;
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                productId={item.product.id}
                name={item.product.name}
                price={item.product.price}
                quantity={item.quantity}
                imageUrl={item.product.imageUrl}
              />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
