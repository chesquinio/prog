"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useUIStore } from "@/lib/store/uiStore";
import { cn } from "@/lib/utils/cn";

const navigationItems = {
  ADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Usuarios", href: "/dashboard/users", icon: "👥" },
    { name: "Edificios", href: "/dashboard/buildings", icon: "🏢" },
    { name: "Aulas", href: "/dashboard/rooms", icon: "🚪" },
    { name: "Reservas", href: "/dashboard/reservations", icon: "📅" },
    { name: "Calendario", href: "/calendar", icon: "📆" },
  ],
  PROFESSOR: [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Mis Clases", href: "/dashboard/classes", icon: "📚" },
    { name: "Reservas", href: "/dashboard/reservations", icon: "📅" },
    { name: "Calendario", href: "/calendar", icon: "📆" },
  ],
  STUDENT: [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Mis Clases", href: "/dashboard/classes", icon: "📚" },
    { name: "Calendario", href: "/calendar", icon: "📆" },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  if (!user) return null;

  const navItems = navigationItems[user.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h1 className="text-xl font-bold text-primary-600">AulaReserve</h1>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info */}
          <div className="border-t p-4">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <span className="text-xl">👤</span>
              Perfil
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
