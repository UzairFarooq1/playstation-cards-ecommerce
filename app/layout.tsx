import { Providers } from "./providers";
import { Navigation } from "./components/Navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import LoadingSpinner from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PSN Deals",
  description: "Buy PlayStation cards and subscriptions online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navigation />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
          <Toaster position="bottom-right" />
          <footer className="bg-gray-800 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              © 2024 PlayStation Cards Ecommerce. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
