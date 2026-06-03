// Live-chat storage in Supabase (table public.chat_messages), accessed ONLY from
// the server with the service_role key. RLS is fully closed, so the public never
// touches Supabase directly and customer data stays isolated.
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
const TABLE = "chat_messages";

export type ChatMsg = { id: number; name: string; body: string; created_at: string };

export function chatEnabled(): boolean {
  return Boolean(URL && KEY);
}

export async function addMessage(name: string, body: string): Promise<ChatMsg | null> {
  if (!URL || !KEY) return null;
  const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ name, body }),
  });
  if (!res.ok) return null;
  const rows = (await res.json().catch(() => [])) as ChatMsg[];
  return rows[0] ?? null;
}

/** New messages after `after` (ascending), or the last 60 if after is 0. */
export async function listMessages(after = 0): Promise<ChatMsg[]> {
  if (!URL || !KEY) return [];
  const base = `${URL}/rest/v1/${TABLE}?select=id,name,body,created_at`;
  const q =
    after > 0
      ? `${base}&id=gt.${after}&order=id.asc&limit=200`
      : `${base}&order=id.desc&limit=60`;
  const res = await fetch(q, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) return [];
  const rows = (await res.json().catch(() => [])) as ChatMsg[];
  return after > 0 ? rows : rows.reverse();
}
