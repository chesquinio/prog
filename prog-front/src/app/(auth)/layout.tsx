export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600">AulaReserve</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Reservas de Aulas
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
