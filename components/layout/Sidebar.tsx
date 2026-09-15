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
      <div className="mb-8">
        <div className="text-base font-bold uppercase tracking-[1.5px] text-ink">
          Todo + Plan
        </div>
        <div className="m-stripe h-[3px] w-10 mt-2" />
      </div>
      <nav className="flex flex-col">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`border-l-2 px-3 py-2.5 text-sm font-bold uppercase tracking-[0.5px] transition-colors ${
                active
                  ? "border-l-m-red text-ink"
                  : "border-l-transparent text-muted hover:text-body hover:border-l-hairline"
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
