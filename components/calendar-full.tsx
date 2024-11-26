"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar and type definitions
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import { EventClickArg, ViewMountArg } from "@fullcalendar/core/index.js";
import { Class, Lesson, Subject, Teacher } from "@prisma/client";
import { format, getDay } from "date-fns";

type Props = {
  lessons: (Lesson & { teacher: Teacher; class: Class; subject: Subject })[];
};

export default function CalendarFull({ lessons }: Props) {
  const handleEventClick = (arg: EventClickArg) => {
    alert(`Event clicked: ${arg.event.title}`);
  };

  const events = lessons.map((lesson) => ({
    title: `${lesson.subject.name} (${lesson.teacher.firstName})`,
    startTime: format(lesson.timeStart, "HH:mm:ss"),
    endTime: format(lesson.timeEnd, "HH:mm:ss"),
    daysOfWeek: [getDay(lesson.timeStart)],
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]} // Include the required plugins
      initialView="timeGridWeek" // Use the custom view
      // views={{
      //   fixedWeek: {
      //     type: "dayGrid", // Use dayGrid as the base view
      //     duration: { days: 7 }, // Fixed duration of 7 days
      //     buttonText: "1 Week", // Button text (if toolbar is enabled)
      //   },
      // }}
      headerToolbar={{
        left: "prev,next today",
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
      viewClassNames="h-[37rem]"
    />
  );
}
