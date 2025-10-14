"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function Protected({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string | string[];
}) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
    if (!loading && user && roles) {
      const ok = hasRole(roles);
      if (!ok) router.push("/");
    }
  }, [loading, user, router, roles, hasRole]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  if (roles && !hasRole(roles)) return null;

  return <>{children}</>;
}
