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
    <aside className="w-56 shrink-0 border-r border-hairline bg-canvas p-4">
      <div className="text-lg font-bold text-primary mb-6">할일 + 계획</div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-surface-strong font-semibold text-ink"
                  : "text-body hover:bg-surface-soft"
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
