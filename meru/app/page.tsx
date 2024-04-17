import EventCalendar from "./EventCalendar";
import { getEvents } from "@/api/events";

export default async function Home() {
  const events = await getEvents();
  return (
    <main className="">
      <EventCalendar events={events} />
    </main>
  );
}
