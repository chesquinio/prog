"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <a href="/" className="text-lg font-semibold">
            Prog Reservas
          </a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button size="sm" variant="ghost" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <a href="/auth" className="text-sm text-blue-600">
              Iniciar sesión
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
