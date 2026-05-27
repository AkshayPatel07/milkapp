"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Menu,
  Milk,
  PhoneIcon,
  User,
  Search,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BUSINESS_PHONE_E164,
  BUSINESS_PHONE_DISPLAY,
} from "@/lib/config";
import { Input } from "@/components/ui/input";

export function Header() {
  const { items } = useCart();

  const cartCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const [menuOpen, setMenuOpen] =
    useState(false);

  const pathname = usePathname();
  const searchParams =
    useSearchParams();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [productQuery, setProductQuery] =
    useState("");

  const isActive = (path: string) =>
    path === "/"
      ? pathname === "/"
      : pathname?.startsWith(path);

  useEffect(() => {
    fetch("/api/auth/me", {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) =>
        setIsLoggedIn(
          Boolean(data?.user),
        ),
      )
      .catch(() =>
        setIsLoggedIn(false),
      );
  }, []);

  useEffect(() => {
    const q =
      searchParams?.get("q") || "";

    setProductQuery(q);
  }, [searchParams]);

  const submitProductSearch = (
    raw: string,
  ) => {
    const q = raw.trim();

    if (!q) {
      router.push("/products");
      return;
    }

    router.push(
      `/products?q=${encodeURIComponent(
        q,
      )}`,
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur text-primary">

      <div className="max-w-6xl mx-auto px-4 py-3">

        {/* Top Header */}
        <div className="flex items-center justify-between gap-4">

          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-xl"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Milk className="h-5 w-5 text-white" />
            </div>

            <span>
              FreshMilk
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="flex-1 max-w-[50%]">

            <form
              className="hidden md:flex"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();

                submitProductSearch(
                  productQuery,
                );
              }}
            >
              <div className="relative w-full">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />

                <Input
                  value={
                    productQuery
                  }
                  onChange={(e) =>
                    setProductQuery(
                      e.target
                        .value,
                    )
                  }
                  placeholder="Search products..."
                  className="pl-9"
                />
              </div>
            </form>

          </div>

          <div className="flex items-center gap-2 md:gap-4">

            <Button className="hidden lg:flex">
              Download the App &
              claim Offers
            </Button>

            <Link
              href={
                isLoggedIn
                  ? "/account"
                  : "/login"
              }
              className="hidden md:flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
            >
              <User className="h-5 w-5" />

              {isLoggedIn
                ? "Account"
                : "Login"}
            </Link>

            {/* Cart */}
            <div className="relative">

              <Link href="/cart">

                <ShoppingCart className="h-5 w-5" />

                {cartCount >
                  0 && (
                  <div className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs text-white bg-primary rounded-full">
                    {
                      cartCount
                    }
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
                onClick={() =>
                  setMenuOpen(
                    true,
                  )
                }
              >
                <Menu className="h-5 w-5" />
              </Button>

              {menuOpen && (

                <div
  className={cn(
    "fixed inset-0 z-[9999] flex transition-all duration-300",
    menuOpen
      ? "pointer-events-auto"
      : "pointer-events-none",
  )}
>

  {/* Overlay */}
 <div
  className={cn(
    "absolute inset-0 z-0 backdrop-blur-sm transition-all duration-300 ease-out",
    menuOpen
      ? "bg-black/50 opacity-100"
      : "bg-black/0 opacity-0",
  )}
  onClick={() => setMenuOpen(false)}
/>

  {/* Drawer */}
<div
  className="
    relative
    z-10
    ml-auto
    w-[320px]
    sm:w-[360px]
    h-screen
    bg-background
    p-6
    shadow-2xl
    overflow-y-auto

    animate-[slideDrawer_.1s_ease-in-out]
  "
>
                  

                    <button
                      className="absolute top-4 right-4 text-lg"
                      onClick={() =>
                        setMenuOpen(
                          false,
                        )
                      }
                    >
                      ✕
                    </button>

                    {/* Search */}
                    <form
                      className="mt-10"
                      onSubmit={(
                        e,
                      ) => {
                        e.preventDefault();

                        submitProductSearch(
                          productQuery,
                        );

                        setMenuOpen(
                          false,
                        );
                      }}
                    >

                      <div className="relative">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />

                        <Input
                          value={
                            productQuery
                          }
                          onChange={(
                            e,
                          ) =>
                            setProductQuery(
                              e
                                .target
                                .value,
                            )
                          }
                          placeholder="Search products..."
                          className="pl-9"
                        />

                      </div>

                    </form>

                    {/* Mobile Links */}
                    <nav className="flex flex-col gap-5 mt-8">

                      <Link
                        href="/"
                        onClick={() =>
                          setMenuOpen(
                            false,
                          )
                        }
                      >
                        Home
                      </Link>

                      <Link
                        href="/products"
                        onClick={() =>
                          setMenuOpen(
                            false,
                          )
                        }
                      >
                        Products
                      </Link>

                      <Link
                        href="/about"
                        onClick={() =>
                          setMenuOpen(
                            false,
                          )
                        }
                      >
                        About Us
                      </Link>

                      <Link
                        href="/contact"
                        onClick={() =>
                          setMenuOpen(
                            false,
                          )
                        }
                      >
                        Contact
                      </Link>

                      <Link
                        href="/refer-earn"
                        onClick={() =>
                          setMenuOpen(
                            false,
                          )
                        }
                      >
                        Refer & Earn
                      </Link>

                      <Link
                        href={
                          isLoggedIn
                            ? "/account"
                            : "/login"
                        }
                        onClick={() =>
                          setMenuOpen(
                            false,
                          )
                        }
                      >
                        {isLoggedIn
                          ? "Account"
                          : "Login"}
                      </Link>

                      <Link
                        href={`tel:${BUSINESS_PHONE_E164}`}
                        className="flex items-center gap-2 pt-5 border-t"
                      >
                        <PhoneIcon className="h-4 w-4" />

                        {
                          BUSINESS_PHONE_DISPLAY
                        }

                      </Link>

                    </nav>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* Desktop Bottom Nav */}
        <div className="flex justify-between w-full pt-3 pl-36">

          <nav className="hidden md:flex">

            <ul className="flex items-center divide-x divide-primary">

              <li className="px-4">
                <Link
                  href="/"
                  className={cn(
                    "text-base font-semibold uppercase text-foreground hover:text-primary transition-colors",
                    isActive(
                      "/",
                    ) &&
                      "text-primary underline",
                  )}
                >
                  Home
                </Link>
              </li>

              <li className="px-4">
                <Link
                  href="/products"
                  className={cn(
                    "text-base font-semibold uppercase text-foreground hover:text-primary transition-colors",
                    isActive(
                      "/products",
                    ) &&
                      "text-primary underline",
                  )}
                >
                  Our Products
                </Link>
              </li>

              <li className="px-4">
                <Link
                  href="/about"
                  className={cn(
                    "text-base font-semibold uppercase text-foreground hover:text-primary transition-colors",
                    isActive(
                      "/about",
                    ) &&
                      "text-primary underline",
                  )}
                >
                  About Us
                </Link>
              </li>

              <li className="px-4">
                <Link
                  href="/contact"
                  className={cn(
                    "text-base font-semibold uppercase text-foreground hover:text-primary transition-colors",
                    isActive(
                      "/contact",
                    ) &&
                      "text-primary underline",
                  )}
                >
                  Contact
                </Link>
              </li>

              <li className="px-4">
                <Link
                  href="/refer-earn"
                  className={cn(
                    "text-base font-semibold uppercase text-foreground hover:text-primary transition-colors",
                    isActive(
                      "/refer-earn",
                    ) &&
                      "text-primary underline",
                  )}
                >
                  Refer & Earn
                </Link>
              </li>

            </ul>

          </nav>

          <Link
            href={`tel:${BUSINESS_PHONE_E164}`}
            className="hidden lg:flex items-center gap-2 text-lg font-semibold hover:text-primary"
          >
            <PhoneIcon className="h-5 w-5" />

            {
              BUSINESS_PHONE_DISPLAY
            }

          </Link>

        </div>

      </div>

    </header>
  );
}