"use client";
import { DateTime, Settings } from "luxon";
// import { useMemo } from "react";

import { Calendar, Views, luxonLocalizer } from "react-big-calendar";
import { HiCheckCircle } from "react-icons/hi";

// only use `Settings` if you require optional time zone support
Settings.defaultZone = "Europe/Helsinki";
// end optional time zone support

// Luxon uses the Intl API, which currently does not contain `weekInfo`
// to determine which weekday is the start of the week by `culture`.
// The `luxonLocalizer` defaults this to Sunday, which differs from
// the Luxon default of Monday. The localizer requires this option
// to change the display, and the date math for determining the
// start of a week. Luxon uses non-zero based values for `weekday`.
const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });

const weekNumberMap = {
  week1: 1,
  week2: 2,
  week3: 3,
};

// Define a mapping of weekdays to their respective numerical representation
const weekdayMap = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

// https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/rendering.js
function transformEvents(events: {}) {
  const currentLocalDate = DateTime.local().setZone("Europe/Helsinki");
  const formattedEvents = [];

  const weekNumberMap = {
    week1: 1,
    week2: 2,
    week3: 3,
  };

  // Define a mapping of weekdays to their respective numerical representation
  const weekdayMap = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
  };

  // Iterate through each week in the events
  for (const week in events) {
    if (events.hasOwnProperty(week)) {
      const weekEvents = events[week];
      const weekNumber = weekNumberMap[week];
      const fisrtWeekOfMonth = currentLocalDate.startOf("month").weekNumber - 1;

      // Iterate through each event in the week
      weekEvents.forEach((event) => {
        // Extract title and weekday
        const title = event.title;

        const startDate = DateTime.fromObject({
          weekYear: currentLocalDate.get("year"),
          weekNumber: fisrtWeekOfMonth + weekNumber,
          weekDay: weekdayMap[event.weekday],
        });

        // Calculate the end date (assuming each event is one day)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.get("day") + 1);

        // Format the dates as required (YYYY-MM-DD)
        const formattedStartDate = startDate.toISODate();
        const formattedEndDate = endDate.toISOString().split("T")[0];

        formattedEvents.push({
          title: title,
          start: new Date(formattedStartDate),
          end: new Date(formattedEndDate),
          completed: event.completed,
          weekday: event.weekday,
          allDay: true,
        });
      });
    }
  }
  return formattedEvents;
}

// Example usage:
const events = {
  week1: [
    {
      weekday: "MONDAY",
      title: "The Meru Health Program",
      completed: true,
    },
    {
      weekday: "WEDNESDAY",
      title: "Introduction to the Program",
      completed: true,
    },
    {
      weekday: "FRIDAY",
      title: "The Science Behind Mindfulness",
      completed: true,
    },
  ],
  week2: [
    {
      weekday: "MONDAY",
      title: "Mind on Autopilot",
      completed: true,
    },
    {
      weekday: "WEDNESDAY",
      title: "Mindful Presence",
      completed: false,
    },
    {
      weekday: "FRIDAY",
      title: "Consequences of Autopilot",
      completed: false,
    },
  ],
  week3: [
    {
      weekday: "MONDAY",
      title: "The Negativity Spiral",
      completed: false,
    },
    {
      weekday: "WEDNESDAY",
      title: "Spiral of Negative Interpretations",
      completed: false,
    },
    {
      weekday: "FRIDAY",
      title: "Interrupting the Negativity Spiral",
      completed: false,
    },
  ],
  // Additional weeks...
};

const formattedEvents = transformEvents(events);

// shift days if incomplete
function shiftDays(formattedEvents) {
  let now = DateTime.local();

  let incomplete = [...formattedEvents].filter((f) => !f.completed);
  console.log("incomplete", incomplete, formattedEvents);

  let reassigned = [];

  let startCounterDate = DateTime.local();

  function nextDayofWeek(now, event) {
    return now.plus({
      days: (weekdayMap[event.weekday] + 7 - now.weekday) % 7,
    });
  }

  incomplete.forEach((event, index) => {
    console.log(
      startCounterDate.get("day"),
      `next ${event.title} on ${event.weekday}`,
      nextDayofWeek(startCounterDate, event).get("day")
    );

    reassigned.push({
      ...event,
      start: new Date(nextDayofWeek(startCounterDate, event).toISODate()),
      end: new Date(
        nextDayofWeek(startCounterDate, event).toISODate().split("T")[0]
      ),
    });
    startCounterDate = nextDayofWeek(startCounterDate, event).plus({ days: 1 });
  });

  return reassigned;
}

const EventCalendar = () => {
  const currentLocalDate = DateTime.local().setZone("Europe/Helsinki");

  return (
    <div>
      <div>
        <h2>
          {currentLocalDate.toLocaleString({ month: "long", year: "numeric" })}
        </h2>
        <Calendar
          components={{
            eventWrapper: ({ event }) => {
              return (
                <div
                  className={`w-full h-full bg-transparent text-center text-pretty text-xs uppercase overflow-hidden px-0.5 h-64 ${
                    event.completed && "text-green-600"
                  }`}
                >
                  {event.completed && (
                    <HiCheckCircle className="block w-full text-center" />
                  )}
                  {event.title}
                </div>
              );
            },
            dateCellWrapper: (obj) => {
              const { children, value } = obj;
              // cell dates
              const cellDate = DateTime.fromJSDate(value);
              const currentDate = cellDate.get("day");
              const currentMonth = cellDate.get("month");

              const dayWithEvent = formattedEvents.find((event) => {
                const eventStartDate = DateTime.fromJSDate(event.start).get(
                  "day"
                );
                const eventStartMonth = DateTime.fromJSDate(event.start).get(
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
          events={[...formattedEvents]
            .filter((e) => e.completed)
            .concat(shiftDays(formattedEvents))}
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
