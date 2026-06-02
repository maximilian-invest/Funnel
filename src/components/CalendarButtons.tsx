"use client";

import { CalendarPlus } from "lucide-react";
import { googleCalendarUrl, outlookCalendarUrl, icsDataUri } from "@/lib/calendar";

export function CalendarButtons() {
  return (
    <div className="cal-row">
      <a className="cal-btn" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
        <CalendarPlus size={17} /> Google Kalender
      </a>
      <a className="cal-btn" href={icsDataUri()} download="allround-webinar.ics">
        <CalendarPlus size={17} /> Apple Kalender
      </a>
      <a className="cal-btn" href={outlookCalendarUrl()} target="_blank" rel="noopener noreferrer">
        <CalendarPlus size={17} /> Outlook
      </a>
    </div>
  );
}
