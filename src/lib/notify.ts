// Lead notification for new webinar registrations.
// The site is a static export (no backend), so we use FormSubmit
// (https://formsubmit.co) to email the team on each signup — no API key needed.
//
// ONE-TIME ACTIVATION: the very first submission sends a confirmation link to the
// recipient address below; click it once to start receiving mails. After that you
// may replace the address with the random FormSubmit alias (from the activation
// email) to keep the address out of the page source.
const ENDPOINT = "https://formsubmit.co/ajax/office@simplesolution.at";

export async function notifyRegistration(name: string, email: string): Promise<void> {
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: "Neue Webinar-Anmeldung — ALLROUND.IMMO",
        Name: name,
        "E-Mail": email,
        _template: "table",
        _captcha: "false",
      }),
    });
  } catch {
    // best-effort; never block the signup flow
  }
}
