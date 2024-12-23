"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export function Navigation() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          setCartItemCount(
            data.reduce(
              (sum: number, item: { quantity: number }) => sum + item.quantity,
              0
            )
          );
        }
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };

    if (session) {
      fetchCartItemCount();
      const intervalId = setInterval(fetchCartItemCount, 5000);
      return () => clearInterval(intervalId);
    } else {
      setCartItemCount(0);
    }
  }, [session]);

  const isAdmin = session?.user?.role === "ADMIN";

  const handleNavigation = (href: string) => {
    router.push(href);
    closeMobileMenu();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/psn.png" width={50} height={50} alt="psn deals" />
                <span className="text-2xl font-bold text-indigo-600">
                  PSN Deals
                </span>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`${
                  pathname === "/"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                href="/product"
                className={`${
                  pathname === "/product"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Products
              </Link>
            </div>
          </div>

          {/* Desktop navigation icons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              {session ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/cart"
                    className="text-gray-400 hover:text-gray-500 relative"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <User className="h-6 w-6" />
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <Settings className="h-6 w-6" />
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <LogIn className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile header icons */}
          <div className="flex items-center space-x-4 sm:hidden">
            {session ? (
              <>
                <Link
                  href="/cart"
                  className="text-gray-400 hover:text-gray-500 relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <User className="h-6 w-6" />
                </Link>
              </>
            ) : (
              <Link href="/login" className="text-gray-400 hover:text-gray-500">
                <LogIn className="h-6 w-6" />
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={() => handleNavigation("/")}
            className={`${
              pathname === "/"
                ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("/product")}
            className={`${
              pathname === "/product"
                ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
          >
            Products
          </button>

          {session && (
            <>
              {isAdmin && (
                <button
                  onClick={() => handleNavigation("/admin")}
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                >
                  Admin
                </button>
              )}
              <button
                onClick={() => {
                  signOut();
                  closeMobileMenu();
                }}
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
