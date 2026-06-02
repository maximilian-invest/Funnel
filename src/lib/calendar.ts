import { WEBINAR } from "./constants";

const TITLE = "ALLROUND.IMMO · Live-Webinar";
const DETAILS =
  "Vom Inserat zur Entscheidung: Cashflow, Rendite & Risiko jedes Objekts auf einen Blick. Die Zugangsdaten kommen per E-Mail.";
const LOCATION = "Live online";

function pad(n: number) {
  return n < 10 ? "0" + n : "" + n;
}

/** UTC timestamp in iCal/Google format: YYYYMMDDTHHMMSSZ */
function toICalUTC(d: Date) {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function bounds() {
  const start = WEBINAR.date;
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 60 min
  return { start, end };
}

export function googleCalendarUrl() {
  const { start, end } = bounds();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    dates: `${toICalUTC(start)}/${toICalUTC(end)}`,
    details: DETAILS,
    location: LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl() {
  const { start, end } = bounds();
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: TITLE,
    body: DETAILS,
    location: LOCATION,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** A downloadable .ics (Apple Calendar / generic) as a data URI. */
export function icsDataUri() {
  const { start, end } = bounds();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ALLROUND.IMMO//Webinar//DE",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:webinar-${start.getTime()}@allround.immo`,
    `DTSTAMP:${toICalUTC(new Date())}`,
    `DTSTART:${toICalUTC(start)}`,
    `DTEND:${toICalUTC(end)}`,
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DETAILS}`,
    `LOCATION:${LOCATION}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
}
