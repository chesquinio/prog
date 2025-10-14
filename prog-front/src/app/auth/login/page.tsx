"use client";
import { useState } from "react";
import axios from "../../../lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("/auth/login", { email, password });
      if (res.status === 200) {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Iniciar sesión</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <Button type="submit">Entrar</Button>
      </form>
    </div>
  );
}
