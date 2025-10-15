export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function formatRole(role: string): string {
  const roleMap: Record<string, string> = {
    ADMIN: "Administrador",
    PROFESSOR: "Profesor",
    STUDENT: "Estudiante",
  };
  return roleMap[role] || role;
}

export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ACTIVE: "Activa",
    CANCELLED: "Cancelada",
  };
  return statusMap[status] || status;
}
