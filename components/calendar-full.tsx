"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar and type definitions
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import { EventClickArg, ViewMountArg } from "@fullcalendar/core/index.js";

export default function CalendarFull() {
  const handleEventClick = (arg: EventClickArg) => {
    alert(`Event clicked: ${arg.event.title}`);
  };

  const events = [
    {
      title: "Recurring Event",
      startTime: "10:00:00",
      endTime: "11:00:00",
      daysOfWeek: [2, 3, 5], // Mondays, Wednesdays, Fridays
    },
  ];

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]} // Include the required plugins
      initialView="fixedWeek" // Use the custom view
      views={{
        fixedWeek: {
          type: "dayGrid", // Use dayGrid as the base view
          duration: { days: 7 }, // Fixed duration of 7 days
          buttonText: "1 Week", // Button text (if toolbar is enabled)
        },
      }}
      headerToolbar={{
        left: undefined,
        center: undefined,
        right: "timeGridWeek,timeGridDay",
      }}
      events={events}
      dayHeaderFormat={{ weekday: "long" }}
      slotLabelFormat={{
        hour: "2-digit", // Always show two digits for the hour
        minute: "2-digit", // Show minutes
        hour12: false, // Use 24-hour format
      }}
      eventTimeFormat={{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Use 24-hour format for events
      }}
      slotMinTime="07:00:00" // Start of the displayed time range
      slotMaxTime="17:00:00" // End of the displayed time range
      viewClassNames="h-[20rem]"
    />
  );
}
