import Link from "next/link";
import { footerLinks } from "@/lib/navigation";
import { Mail } from "lucide-react";

export const SiteFooter = () => (
  <footer className="border-t border-zinc-100 bg-zinc-50">
    <div className="section-container grid gap-10 py-12 md:grid-cols-4">
      <div>
        <img
          src="/Robocoz_1.png"
          alt="Robocoz"
          className="h-8 w-auto mb-5"
        />
        <p className="mt-3 text-sm text-zinc-600">
          Precision electronics components, on-demand 3D printing and custom PCB
          manufacturing trusted by engineers and makers worldwide.
        </p>
        <form className="mt-8 -ml-2 flex gap-2">
          <input
            type="email"
            placeholder="you@company.com"
            className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm"
          />
          <button className="rounded-full bg-brand px-4 ml-3 py-2 text-sm font-semibold text-white">
            Join
          </button>
        </form>
      </div>
      {Object.entries(footerLinks).map(([section, links]) => (
        <div key={section}>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {section}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition hover:text-brand-dark"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-zinc-100">
      <div className="section-container flex flex-col gap-4 py-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4" />
          <span>hello@robocoz.com</span>
        </div>
        <p>© {new Date().getFullYear()} Robocoz. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

