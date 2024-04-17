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

export const getEvents = async () => events;
