"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Milk, PhoneIcon } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-foreground backdrop-blur text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Milk className="h-5 w-5 text-white" />
            </div>
            <span>FreshMilk</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-base font-medium hover:text-primary transition-colors",
                isActive("/") && "text-primary font-semibold"
              )}
              aria-current={isActive("/") ? "page" : undefined}
            >
              Home
            </Link>

            <Link
              href="/products"
              className={cn(
                "text-base font-medium hover:text-primary transition-colors",
                isActive("/products") && "text-primary font-semibold"
              )}
              aria-current={isActive("/products") ? "page" : undefined}
            >
              Products
            </Link>

            <Link
              href="/about"
              className={cn(
                "text-base font-medium hover:text-primary transition-colors",
                isActive("/about") && "text-primary font-semibold"
              )}
              aria-current={isActive("/about") ? "page" : undefined}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={cn(
                "text-base font-medium hover:text-primary transition-colors",
                isActive("/contact") && "text-primary font-semibold"
              )}
              aria-current={isActive("/contact") ? "page" : undefined}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div>
              <Link
                href="tel:123456789"
                className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors"
              >
                <PhoneIcon className="h-5 w-5" /> 123456789
              </Link>
            </div>
            <div className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs text-foreground bg-primary rounded-full">
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button
              hideIcon
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {menuOpen && (
                <div
                  className="fixed inset-0 z-50 flex h-screen"
                  role="dialog"
                  aria-modal="true"
                >
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm h-screen"
                    onClick={() => setMenuOpen(false)}
                  />
                  {/* Panel */}
                  <div className="relative ml-auto w-64 max-w-full h-full bg-foreground p-6 shadow-lg transform transition-transform duration-200 ease-in-out">
                    <button
                      className="absolute top-4 right-4 p-1"
                      onClick={() => setMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      x
                    </button>

                    <nav className="flex flex-col gap-4 mt-6">
                      <Link
                        href="/"
                        onClick={() => setMenuOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        Home
                      </Link>
                      <Link
                        href="/products"
                        onClick={() => setMenuOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        Products
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setMenuOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        About Us
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        Contact
                      </Link>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
