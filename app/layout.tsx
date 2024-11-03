import { Providers } from "./providers";
import { Navigation } from "./components/Navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PlayStation Cards Ecommerce",
  description: "Buy PlayStation cards online",
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
          <main className="flex-grow">{children}</main>
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
