"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Reveal } from "./Reveal";
import { STORAGE, WEBINAR } from "@/lib/constants";

type ChatMsg = { id: number; name: string; body: string; created_at: string };

const REACTIONS = ["👍", "🔥", "👏", "❤️"];
const AV_COLORS = ["#ef4444", "#8b5cf6", "#34d399", "#ec4899", "#3b82f6", "#f59e0b"];

function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AV_COLORS[h % AV_COLORS.length];
}
function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function WebinarChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const lastId = useRef(0);
  const msgsRef = useRef<HTMLDivElement>(null);

  // prefill the display name from the signup (sessionStorage) or a prior chat
  useEffect(() => {
    try {
      const n =
        localStorage.getItem("ai_chat_name") || sessionStorage.getItem(STORAGE.firstName) || "";
      if (n) setName(n);
    } catch {
      /* ignore */
    }
  }, []);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      const m = msgsRef.current;
      if (m) m.scrollTop = m.scrollHeight;
    });
  }

  // initial load + polling for new messages
  useEffect(() => {
    let alive = true;
    async function poll(initial = false) {
      if (!initial && typeof document !== "undefined" && document.hidden) return;
      try {
        const url = lastId.current > 0 ? `/api/chat?after=${lastId.current}` : "/api/chat";
        const res = await fetch(url);
        const data = await res.json();
        const incoming: ChatMsg[] = data?.messages ?? [];
        if (!alive || incoming.length === 0) return;
        setMessages((prev) => {
          const base = initial ? [] : prev;
          const have = new Set(base.map((m) => m.id));
          const add = incoming.filter((m) => !have.has(m.id));
          return add.length ? [...base, ...add] : base;
        });
        lastId.current = Math.max(lastId.current, ...incoming.map((m) => m.id));
        scrollToBottom();
      } catch {
        /* ignore */
      }
    }
    poll(true);
    const id = setInterval(() => poll(false), 3500);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  function saveName(v: string) {
    setName(v);
    try {
      localStorage.setItem("ai_chat_name", v.trim());
    } catch {
      /* ignore */
    }
  }

  async function send() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "Gast", body }),
      });
      const data = await res.json();
      const msg: ChatMsg | null = data?.message ?? null;
      if (msg) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        lastId.current = Math.max(lastId.current, msg.id);
        scrollToBottom();
      }
    } catch {
      /* ignore */
    }
  }

  function spawnReaction(glyph: string, x: number, y: number) {
    const node = document.createElement("div");
    node.className = "float-react";
    node.textContent = glyph;
    node.style.left = x - 13 + "px";
    node.style.top = y - 20 + "px";
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2300);
  }

  return (
    <Reveal as="aside" className="chat" delay={0.08} aria-label="Live-Chat">
      <div className="chat-head">
        <span className="ttl">Live-Chat</span>
        <span className="cnt">
          <span
            className="badge-dot live"
            style={{ background: "#34d399", display: "inline-block" }}
          />{" "}
          Live
        </span>
      </div>
      <div className="chat-msgs" ref={msgsRef}>
        {messages.length === 0 ? (
          <div className="chat-empty">Noch keine Nachrichten — schreib die erste! 👋</div>
        ) : (
          messages.map((m) => (
            <div className="cmsg" key={m.id}>
              <span className="av" style={{ background: colorFor(m.name) }}>
                {initials(m.name)}
              </span>
              <div className="cm-body">
                <div className={"nm" + (m.name === WEBINAR.host ? " host" : "")}>{m.name}</div>
                <div className="tx">{m.body}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="reactions">
        {REACTIONS.map((r) => (
          <button
            key={r}
            aria-label={`Reaktion ${r}`}
            onClick={(e) => spawnReaction(r, e.clientX, e.clientY)}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="chat-name">
        <input
          type="text"
          placeholder="Dein Name"
          aria-label="Dein Name"
          value={name}
          maxLength={40}
          onChange={(e) => saveName(e.target.value)}
        />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Nachricht schreiben …"
          aria-label="Nachricht"
          value={draft}
          maxLength={400}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button className="send" aria-label="Senden" onClick={send}>
          <Send size={18} />
        </button>
      </div>
    </Reveal>
  );
}
