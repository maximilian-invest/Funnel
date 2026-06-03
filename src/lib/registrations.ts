// Persists webinar registrations in the existing Supabase project (table
// public.webinar_registrations) via the PostgREST HTTP API — no SDK needed.
// Uses the service_role key (server-only); RLS keeps the list private.
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
const TABLE = "webinar_registrations";

export type Registrant = { name: string; email: string; created_at?: string };

export function supabaseEnabled(): boolean {
  return Boolean(URL && KEY);
}

/** Insert (or update on duplicate email) one registration. */
export async function addRegistration(name: string, email: string): Promise<void> {
  if (!URL || !KEY) return;
  await fetch(`${URL}/rest/v1/${TABLE}?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ name, email }),
  });
}

/** All registrations, newest first. */
export async function listRegistrations(): Promise<Registrant[]> {
  if (!URL || !KEY) return [];
  const res = await fetch(
    `${URL}/rest/v1/${TABLE}?select=name,email,created_at&order=created_at.desc`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
  );
  if (!res.ok) return [];
  return (await res.json().catch(() => [])) as Registrant[];
}
