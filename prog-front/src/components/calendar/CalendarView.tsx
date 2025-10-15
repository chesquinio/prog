"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  reservationCounts?: Record<string, number>;
}

export default function CalendarView({
  selectedDate,
  onDateSelect,
  reservationCounts = {},
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { locale: es });
  const endDate = endOfWeek(monthEnd, { locale: es });

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getReservationCount = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return reservationCounts[dateKey] || 0;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-2">
            {week.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const reservationCount = getReservationCount(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => onDateSelect(day)}
                  className={`
                    relative aspect-square rounded-lg p-2 text-sm transition-colors
                    ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}
                    ${
                      isSelected
                        ? "bg-primary-600 text-white"
                        : "hover:bg-gray-100"
                    }
                    ${isToday && !isSelected ? "ring-2 ring-primary-600" : ""}
                  `}
                >
                  <span className="block text-center">{format(day, "d")}</span>
                  {reservationCount > 0 && (
                    <span
                      className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                        isSelected ? "bg-white" : "bg-primary-600"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded ring-2 ring-primary-600" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary-600" />
            <span>Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary-600" />
            <span>Tiene reservas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
