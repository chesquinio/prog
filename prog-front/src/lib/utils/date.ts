import { format, parseISO, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: string | Date, pattern = "PPP"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: es });
}

export function formatDateTime(date: string | Date, pattern = "PPP p"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: es });
}

export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
}

export function formatTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "HH:mm");
}
