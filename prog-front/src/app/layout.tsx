import "../globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../hooks/useAuth";
import { ReactQueryProvider } from "../lib/queryClient";
import { Toaster } from "react-hot-toast";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "Prog - Reservas",
  description: "Frontend para la plataforma de reservas de aulas",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Topbar />
              <div className="container mx-auto p-4 flex gap-6">
                <Sidebar />
                <main className="flex-1">{children}</main>
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
