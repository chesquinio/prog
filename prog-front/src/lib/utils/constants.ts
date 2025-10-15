// Constantes de la aplicación

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "AulaReserve";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const ROLES = {
  ADMIN: "ADMIN",
  PROFESSOR: "PROFESSOR",
  STUDENT: "STUDENT",
} as const;

export const RESERVATION_STATUS = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CALENDAR: "/calendar",
  CLASSES: "/dashboard/classes",
  RESERVATIONS: "/dashboard/reservations",
  BUILDINGS: "/dashboard/buildings",
  ROOMS: "/dashboard/rooms",
  USERS: "/dashboard/users",
  PROFILE: "/dashboard/profile",
} as const;
