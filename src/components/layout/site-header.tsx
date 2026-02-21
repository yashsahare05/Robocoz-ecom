"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import { primaryNav } from "@/lib/navigation";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/components/providers/session-provider";

const serviceLinks = [
  { name: "PCB Manufacturing", href: "/services/pcb-manufacturing" },
  {
    name: "3D Printing",
    href: "/services/3d-printing",
    children: [
      { name: "FDM Printing", href: "/services/3d-printing/fdm-page" },
      { name: "SLA Printing", href: "/services/3d-printing/sla-page" },
    ],
  },
  {
    name: "Laser Cutting",
    href: "/services/laser-cutting",
    children: [
      { name: "Metal Cutting", href: "/services/laser-cutting#metal" },
      { name: "Non-Metal Cutting", href: "/services/laser-cutting#non-metal" },
    ],
  },
  
  
];

export const SiteHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAdminAuth();
  const cartCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesClosing, setServicesClosing] = useState(false);
  const [servicesForceOpen, setServicesForceOpen] = useState(false);

  const handleServicesNavigate = (href: string) => {
    setMenuOpen(false);
    setServicesForceOpen(true);
    setServicesClosing(false);
    requestAnimationFrame(() => {
      setServicesClosing(true);
    });
    window.setTimeout(() => {
      setServicesClosing(false);
      setServicesForceOpen(false);
      router.push(href);
    }, 1000);
  };
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-300 bg-gray-100/90 backdrop-blur">
      <div className="section-container flex items-center gap-4 py-1">
        <div className="flex flex-1 items-center gap-3">
          <button
            className="rounded-lg border border-zinc-200 p-2 lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5 text-zinc-700" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.gif" alt="Robocoz" className="h-16 w-auto" />
          </Link>
        </div>

        <nav
          className={cn(
            "items-center gap-10 text-sm font-medium text-zinc-600 lg:flex",
            menuOpen ? "flex flex-col lg:flex-row" : "hidden lg:flex",
          )}
        >
          {primaryNav.map((item) => {
            const resolvedItem =
              item.name === "Contact" && isAdmin
                ? { name: "Dashboard", href: "/admin" }
                : item;
            return resolvedItem.name === "Services" ? (
              <div key={item.name} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 transition hover:text-brand-dark",
                    pathname.startsWith(item.href) && "text-brand-dark",
                  )}
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  {item.name}
                  <span className="text-lg  text-zinc-500 transition-transform duration-200 rotate-90 lg:group-hover:-rotate-90">
                    ›
                  </span>
                </Link>
                <div className="absolute left-0 top-full min-w-[14rem] pt-6">
                  <div
                    className={cn(
                      "pointer-events-none max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity,transform] duration-300 ease-out",
                      servicesForceOpen &&
                        !servicesClosing &&
                        "pointer-events-auto max-h-[28rem] opacity-100 translate-y-0",
                      servicesClosing &&
                        "pointer-events-none max-h-0 opacity-0 translate-y-2",
                      !servicesForceOpen &&
                        !servicesClosing &&
                        "translate-y-0 lg:group-hover:pointer-events-auto lg:group-hover:max-h-[28rem] lg:group-hover:opacity-100",
                    )}
                  >
                  <div className="rounded-md border border-zinc-200 bg-gray-100/100 backdrop-blur p-2 shadow-lg">
                    {serviceLinks.map((service) =>
                      service.children ? (
                        <div key={service.name} className="group/sub relative ">
                            <Link
                              href={service.href}
                              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 transition hover:text-brand-dark"
                              onClick={(event) => {
                                event.preventDefault();
                                handleServicesNavigate(service.href);
                              }}
                            >
                            <span>{service.name}</span>
                            <span className="text-lg text-zinc-400 transition-transform duration-200 lg:group-hover/sub:rotate-90">›</span>
                          </Link>
                          <div className="pointer-events-none max-h-0 overflow-hidden opacity-0 lg:group-hover/sub:pointer-events-auto lg:group-hover/sub:max-h-64 lg:group-hover/sub:opacity-100">
                            <div className="border-t border-zinc-100 pt-2">
                              {service.children.map((child) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className="block rounded-lg px-8 py-2 text-sm text-zinc-700 transition hover:text-brand-dark"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleServicesNavigate(child.href);
                                  }}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={service.name}
                          href={service.href}
                          className="block rounded-lg px-3 py-2 text-sm text-zinc-700 transition hover:text-brand-dark"
                          onClick={(event) => {
                            event.preventDefault();
                            handleServicesNavigate(service.href);
                          }}
                        >
                          {service.name}
                        </Link>
                      )
                    )}
                  </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={resolvedItem.name}
                href={resolvedItem.href}
                className={cn(
                  "transition hover:text-brand-dark",
                  pathname.startsWith(resolvedItem.href) && "text-brand-dark",
                )}
                onClick={() => setMenuOpen(false)}
              >
                {resolvedItem.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden max-w-lg flex-1 items-center  px-2 py-2 text-sm text-zinc-600 lg:flex">
            <input
              type="search"
              placeholder="Search components, services..."
              className="w- bg-transparent max-w-md flex-1 items-center rounded-full border border-t-2 border-b-2 border-l-2 border-r-2 border-zinc-200 px-4 py-2 text-sm text-zinc-600 lg:flex"
            />
          </div>
          <Link
            href="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className="hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-brand hover:text-brand-dark lg:inline-flex"
          >
            Account
          </Link>
        </div>
      </div>
    </header>
  );
};






