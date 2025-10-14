"use client";
import { useState } from "react";
import axios from "../../../lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PROFESSOR");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axios.post("/auth/register", { name, email, password, role });
      setMessage("Registro enviado, espere confirmación del admin");
      window.location.href = "/auth";
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Registro</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm">Nombre</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
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
        <div>
          <label className="block text-sm">Rol</label>
          <Select
            defaultValue={role}
            onValueChange={(val: string) => setRole(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROFESSOR">Profesor</SelectItem>
              <SelectItem value="STUDENT">Alumno</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {message && <div className="text-green-600">{message}</div>}
        <Button type="submit">Registrar</Button>
      </form>
    </div>
  );
}
