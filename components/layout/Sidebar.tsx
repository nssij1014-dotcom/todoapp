"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "대시보드" },
  { href: "/todos", label: "할 일" },
  { href: "/weekly", label: "주간 계획" },
  { href: "/goals", label: "목표" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-black/10 dark:border-white/10 p-4">
      <div className="text-lg font-semibold mb-6">할일 + 계획</div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-black/10 dark:bg-white/10 font-medium"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
