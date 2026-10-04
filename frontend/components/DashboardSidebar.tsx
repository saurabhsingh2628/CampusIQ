"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Academic Intelligence",
    href: "/academic",
  },
  {
    name: "Attendance",
    href: "/attendance",
  },
  {
    name: "AI Performance Analysis",
    href: "/performance-analysis",
  },
  {
    name: "Career Intelligence",
    href: "/career",
  },
  {
    name: "AI Career Advisor",
    href: "/career-advisor",
  },
  {
    name: "AI Skill Gap Analyzer",
    href: "/skill-gap-analysis",
  },
  {
    name: "Placement Intelligence",
    href: "/placement",
  },
  {
    name: "Profile",
    href: "/profile",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-5 relative flex-shrink-0">

      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          Campus<span className="text-blue-500">IQ</span>
        </h1>

        <p className="text-xs text-slate-500 mt-1">
          Student Intelligence Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-6 left-5">
        <p className="text-xs text-slate-500">
          CampusIQ v1.0
        </p>
      </div>

    </aside>
  );
}