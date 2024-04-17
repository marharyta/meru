"use client";

import { DateTime, Settings } from "luxon";
import { Calendar, luxonLocalizer } from "react-big-calendar";
import { HiCheckCircle } from "react-icons/hi";
import {
  transformEvents,
  shiftDays,
  weekNumberMap,
  weekdayMap,
} from "@/lib/utils";
import { BaseEvents, Event, LuxonDateTime } from "@/lib/types";
import jstz from "jstz";

const EventCalendar = ({ events }: { events: BaseEvents }) => {
  const timezone = jstz.determine();

  Settings.defaultZone = timezone.name() || "Europe/Helsinki";
  const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });
  const currentLocalDate: LuxonDateTime = DateTime.local().setZone(
    timezone.name() || "Europe/Helsinki"
  );

  const formattedEvents: Array<Event> = transformEvents(
    events,
    currentLocalDate,
    weekNumberMap,
    weekdayMap
  );

  const completedEvents = formattedEvents[0].completed
    ? [...formattedEvents].filter((e: Event) => e?.completed)
    : [...formattedEvents];

  const rescheduledEvents: Array<Event> = shiftDays(
    formattedEvents,
    currentLocalDate
  );

  return (
    <div>
      <div>
        <h2>
          {currentLocalDate.toLocaleString({ month: "long", year: "numeric" })}
        </h2>
        <Calendar
          components={{
            eventWrapper: ({ event }: { event: any }) => {
              return (
                <div
                  className={`w-full h-full bg-transparent text-center text-pretty text-xs uppercase overflow-hidden px-0.5 h-64 ${
                    event?.completed && "text-green-600"
                  }`}
                >
                  {event?.completed && (
                    <HiCheckCircle className="block w-full text-center" />
                  )}
                  {event?.title}
                </div>
              );
            },
            dateCellWrapper: (obj) => {
              const { children, value } = obj;
              // cell dates
              const cellDate = DateTime.fromJSDate(value);
              const currentDate = cellDate.get("day");
              const currentMonth = cellDate.get("month");

              const dayWithEvent = formattedEvents.find((event: any) => {
                const eventStartDate = DateTime.fromJSDate(event?.start).get(
                  "day"
                );
                const eventStartMonth = DateTime.fromJSDate(event?.start).get(
                  "month"
                );

                let height =
                  eventStartDate === currentDate &&
                  currentMonth === eventStartMonth;
                return height;
              });

              const now = DateTime.now();
              // Compare dates by day, month, and year
              const isSameDayMonthYear =
                cellDate.hasSame(now, "day") &&
                cellDate.hasSame(now, "month") &&
                cellDate.hasSame(now, "year");

              return (
                <div
                  className={`w-full h-full border border-green-500 ${
                    dayWithEvent && " "
                  } ${isSameDayMonthYear && " !bg-green-300 "}`}
                >
                  {children}
                </div>
              );
            },
            month: {
              dateHeader: (obj) => {
                const { date, label } = obj;

                // cell dates
                const cellDate = DateTime.fromJSDate(date);
                const currentDate = cellDate.get("day");
                const currentMonth = cellDate.get("month");

                const dayWithEvent = formattedEvents.find((event) => {
                  const eventStartDate = DateTime.fromJSDate(event.start).get(
                    "day"
                  );
                  const eventStartMonth = DateTime.fromJSDate(event.start).get(
                    "month"
                  );

                  return (
                    eventStartDate === currentDate &&
                    currentMonth === eventStartMonth
                  );
                });

                const now = DateTime.now();

                // Compare dates by day, month, and year
                const isSameDayMonthYear =
                  cellDate.hasSame(now, "day") &&
                  cellDate.hasSame(now, "month") &&
                  cellDate.hasSame(now, "year");

                return (
                  <h1
                    className={` w-full h-full text-center font-semibold text-3xl md:text-6xl mb-3 mt-1 ${
                      dayWithEvent && "text-green-300 "
                    } ${isSameDayMonthYear && "text-white "}`}
                  >
                    {label}
                  </h1>
                );
              },
            },
          }}
          localizer={localizer}
          events={completedEvents.concat(rescheduledEvents)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          toolbar={false}
          defaultView="month"
        />
      </div>
    </div>
  );
};

export default EventCalendar;
