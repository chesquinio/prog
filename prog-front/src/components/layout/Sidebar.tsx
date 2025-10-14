"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  const common = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin/buildings", label: "Edificios" },
  ];

  const admin = [{ href: "/admin/users", label: "Usuarios" }];

  const professor = [{ href: "/reservations/create", label: "Crear reserva" }];

  return (
    <aside className="w-64 hidden md:block">
      <nav className="sticky top-4">
        <ul className="space-y-2">
          {common.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-slate-700">
                {l.label}
              </a>
            </li>
          ))}

          {user &&
            user.role === "ADMIN" &&
            admin.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-slate-700">
                  {l.label}
                </a>
              </li>
            ))}

          {user &&
            user.role === "PROFESSOR" &&
            professor.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-slate-700">
                  {l.label}
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
}
