"use client";

import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigationStore } from "@/app/store/navigationStore";
import { useLocaleStore } from "@/app/store/localeStore";
import Button from "@/app/components/Button";

// ─── Config ────────────────────────────────────────────────────────────────────

const WORKER_URL = "https://pipo-chat.pipoestudioweb.workers.dev";

const CHIPS = {
  es: ["Tipos de madera", "Tiempo de fabricación", "Precios"],
  en: ["Types of wood", "Production time", "Prices"],
};

const STRINGS = {
  es: {
    cta: "Haz click aquí para preguntarme",
    header: "Pregúntame lo que quieras!*",
    welcome: "Seguro que te puedo ayudar con eso!",
    thinking: "pensando muy fuerte...",
    placeholder: "Escribe tu pregunta aquí",
    disclaimer: "*Pipo a veces se equivoca, si crees que la respuesta no es precisa",
    disclaimerBtn: "habla con nosotros directamente",
    error: "Ups, algo salió mal. Inténtalo de nuevo!",
  },
  en: {
    cta: "Click here to ask me",
    header: "Ask me anything!*",
    welcome: "I'm sure I can help you with that!",
    thinking: "thinking really hard...",
    placeholder: "Write your question here",
    disclaimer: "*Pipo sometimes makes mistakes, if you think the answer isn't accurate",
    disclaimerBtn: "talk to us directly",
    error: "Oops, something went wrong. Try again!",
  },
};

// ─── Markdown renderer ─────────────────────────────────────────────────────────

function renderMarkdown(text: string, fs: number, color: string) {
  const paragraphs = text.split(/\n{2,}/);

  return paragraphs.map((para, pi) => {
    const lines = para
      .split("\n")
      .filter((l) => l.trim() !== "" || para.trim() === "");
    const margin = pi > 0 ? "6px 0 0" : 0;

    // Headings
    const headingMatch = para.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const sizes = ["1.1em", "1em", "0.95em"];
      const level = headingMatch[1].length - 1;
      return (
        <p
          key={pi}
          style={{
            margin,
            fontSize: sizes[level],
            color,
            lineHeight: 1.3,
            fontWeight: 700,
          }}
        >
          {inlineMarkdown(headingMatch[2])}
        </p>
      );
    }

    // Unordered lists
    const hasUnordered = lines.some((l) => /^[*\-]\s/.test(l.trim()));
    // Numbered lists
    const hasNumbered = lines.some((l) => /^\d+\.\s/.test(l.trim()));

    if (hasUnordered || hasNumbered) {
      const bulletLines = lines.filter((l) => /^[*\-]\s/.test(l.trim()));
      const numberedLines = lines.filter((l) => /^\d+\.\s/.test(l.trim()));
      const nonList = lines.filter(
        (l) => !/^[*\-]\s/.test(l.trim()) && !/^\d+\.\s/.test(l.trim()),
      );
      return (
        <div key={pi} style={{ margin }}>
          {nonList.map((l, i) => (
            <p
              key={i}
              style={{
                margin: "0 0 4px",
                fontSize: fs,
                color,
                lineHeight: 1.45,
              }}
            >
              {inlineMarkdown(l)}
            </p>
          ))}
          {hasUnordered && (
            <ul
              style={{
                margin: "2px 0 0",
                paddingLeft: 18,
                fontSize: fs,
                color,
                lineHeight: 1.6,
                listStyleType: "disc",
              }}
            >
              {bulletLines.map((l, i) => (
                <li key={i} style={{ listStyleType: "disc" }}>
                  {inlineMarkdown(l.replace(/^[*\-]\s/, ""))}
                </li>
              ))}
            </ul>
          )}
          {hasNumbered && (
            <ol
              style={{
                margin: "2px 0 0",
                paddingLeft: 18,
                fontSize: fs,
                color,
                lineHeight: 1.6,
                listStyleType: "decimal",
              }}
            >
              {numberedLines.map((l, i) => (
                <li key={i} style={{ listStyleType: "decimal" }}>
                  {inlineMarkdown(l.replace(/^\d+\.\s/, ""))}
                </li>
              ))}
            </ol>
          )}
        </div>
      );
    }

    return (
      <p key={pi} style={{ margin, fontSize: fs, color, lineHeight: 1.45 }}>
        {lines.map((l, i) => (
          <span key={i}>
            {inlineMarkdown(l)}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

function inlineMarkdown(text: string): React.ReactNode {
  // Handle **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

// ─── Animation variants ────────────────────────────────────────────────────────

const closedVariants = {
  initial: { opacity: 0, scale: 0.92, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: 6,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const panelVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 30 },
  },
};

// ─── Hook: mobile detection ────────────────────────────────────────────────────

function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 639px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false,
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PipoChat() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamed, setStreamed] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const currentSection = useNavigationStore((s) => s.currentSection);
  const scrollToSection = useNavigationStore((s) => s.scrollToSection);
  const locale = useLocaleStore((s) => s.locale) as "es" | "en";

  const chips = CHIPS[locale] ?? CHIPS.es;
  const t = STRINGS[locale] ?? STRINGS.es;
  const hasConversation = messages.length > 0;

  async function send(text: string) {
    if (!text.trim() || isLoading) return;
    const updated: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setIsLoading(true);
    setStreamed("");

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, language: locale }),
      });

      if (!res.ok || !res.body) throw new Error("fetch error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder
          .decode(value, { stream: true })
          .split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6);
          if (raw === "[DONE]") continue;
          try {
            const { response } = JSON.parse(raw) as { response?: string };
            if (response) {
              buf += response;
              setStreamed(buf);
            }
          } catch {}
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: buf }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            t.error,
        },
      ]);
    } finally {
      setStreamed("");
      setIsLoading(false);
    }
  }

  function close() {
    setIsOpen(false);
    setInput("");
    setStreamed("");
  }

  // Cerrar al tocar fuera del panel (mobile)
  useEffect(() => {
    if (!isOpen || !isMobile) return;
    const handler = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen, isMobile]);

  const visible = currentSection === "inicio";

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {visible && isOpen && isMobile && (
          <motion.div
            key="chat-backdrop"
            data-no-nav-scroll
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            onTouchMove={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 49,
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <div
            data-no-nav-scroll
            style={
              isMobile
                ? {
                    position: "fixed",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    pointerEvents: "none",
                    zIndex: 50,
                  }
                : {
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    pointerEvents: "none",
                    zIndex: 50,
                  }
            }
          >
            <motion.div
              ref={panelRef}
              key="pipo-chat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="pointer-events-auto"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <OpenPanel
                    key="open"
                    messages={messages}
                    streamed={streamed}
                    hasConversation={hasConversation}
                    isLoading={isLoading}
                    input={input}
                    chips={chips}
                    isMobile={isMobile}
                    onInput={setInput}
                    onSend={send}
                    onClose={close}
                    onDisclaimer={() => scrollToSection("contacto")}
                    header={t.header}
                    welcome={t.welcome}
                    thinking={t.thinking}
                    placeholder={t.placeholder}
                    disclaimer={t.disclaimer}
                    disclaimerBtn={t.disclaimerBtn}
                  />
                ) : (
                  <ClosedPanel
                    key="closed"
                    isMobile={isMobile}
                    onOpen={() => setIsOpen(true)}
                    cta={t.cta}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Closed panel ──────────────────────────────────────────────────────────────

function ClosedPanel({
  isMobile,
  onOpen,
  cta,
}: {
  isMobile: boolean;
  onOpen: () => void;
  cta: string;
}) {
  const w = isMobile ? 300 : 370;
  return (
    <motion.div
      variants={closedVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ display: "flex", flexDirection: "column", gap: 8, width: w }}
    >
      {/* CTA button */}
      <motion.button
        onTap={onOpen}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="font-sans font-bold"
        style={{
          background: "#00A750",
          color: "#E4E5E0",
          borderRadius: 6,
          padding: "13px 20px",
          fontSize: isMobile ? 15 : 18,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          letterSpacing: "0.01em",
          lineHeight: 1.2,
        }}
      >
        {cta}
        <ClickIcon />
      </motion.button>
    </motion.div>
  );
}

// ─── Open panel ────────────────────────────────────────────────────────────────

interface OpenPanelProps {
  messages: Message[];
  streamed: string;
  hasConversation: boolean;
  isLoading: boolean;
  input: string;
  chips: string[];
  isMobile: boolean;
  onInput: (v: string) => void;
  onSend: (text: string) => void;
  onClose: () => void;
  onDisclaimer: () => void;
  header: string;
  welcome: string;
  thinking: string;
  placeholder: string;
  disclaimer: string;
  disclaimerBtn: string;
}

function OpenPanel({
  messages,
  streamed,
  hasConversation,
  isLoading,
  input,
  chips,
  isMobile,
  onInput,
  onSend,
  onClose,
  onDisclaimer,
  header,
  welcome,
  thinking,
  placeholder,
  disclaimer,
  disclaimerBtn,
}: OpenPanelProps) {
  const historyRef = useRef<HTMLDivElement>(null);
  const w = isMobile ? 300 : 390;
  const fs = isMobile ? 13 : 15;

  // Auto-scroll al fondo cuando llegan mensajes nuevos o streaming
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, streamed]);

  return (
    <motion.div
      variants={panelVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: w, display: "flex", flexDirection: "column", gap: 6 }}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        style={{
          background: "rgb(228,229,224)",
          borderRadius: 6,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          className="font-sans font-medium"
          style={{ color: "#00A750", fontSize: isMobile ? 14 : 16 }}
        >
          {header}
        </span>
        <motion.button
          onTap={onClose}
          aria-label="Cerrar chat"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#00A750",
            fontSize: 18,
            lineHeight: 1,
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </motion.button>
      </motion.div>

      {/* Historial de mensajes */}
      <motion.div
        variants={itemVariants}
        ref={historyRef}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{
          background: "rgb(228,229,224)",
          borderRadius: 6,
          padding: "10px 12px",
          minHeight: 60,
          maxHeight: isMobile ? 340 : 340,
          overflowY: "auto",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {!hasConversation && !isLoading ? (
          <p
            className="font-sans font-medium"
            style={{ color: "#00A750", fontSize: fs }}
          >
            {welcome}
          </p>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const color = isUser ? "#E4E5E0" : "#00A750";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className="font-sans font-medium"
                    style={{
                      maxWidth: "85%",
                      background: isUser ? "#00A750" : "rgba(0,0,0,0.07)",
                      borderRadius: isUser
                        ? "10px 10px 2px 10px"
                        : "10px 10px 10px 2px",
                      padding: "7px 11px",
                    }}
                  >
                    {isUser ? (
                      <p
                        style={{
                          margin: 0,
                          fontSize: fs,
                          color,
                          lineHeight: 1.45,
                        }}
                      >
                        {msg.content}
                      </p>
                    ) : (
                      renderMarkdown(msg.content, fs, color)
                    )}
                  </div>
                </div>
              );
            })}
            {/* Mensaje en streaming */}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  className="font-sans font-medium"
                  style={{
                    maxWidth: "85%",
                    background: "rgba(0,0,0,0.07)",
                    borderRadius: "10px 10px 10px 2px",
                    padding: "7px 11px",
                    fontStyle: streamed ? "normal" : "italic",
                  }}
                >
                  {streamed ? (
                    renderMarkdown(streamed, fs, "#00A750")
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        fontSize: fs,
                        color: "#00A750",
                        lineHeight: 1.45,
                      }}
                    >
                      {thinking}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Input bar */}
      <motion.div variants={itemVariants}>
        <div
          style={{
            background: "#00A750",
            borderRadius: 6,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <input
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") onSend(input);
            }}
            disabled={isLoading}
            placeholder={placeholder}
            className="font-sans"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#E4E5E0",
              fontSize: fs,
              cursor: isLoading ? "not-allowed" : "text",
              pointerEvents: "auto",
              touchAction: "manipulation",
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSend(input)}
            disabled={isLoading}
            className="shrink-0"
          >
            →
          </Button>
        </div>
      </motion.div>

      {/* Quick reply chips */}
      <motion.div
        variants={itemVariants}
        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
      >
        {chips.map((chip) => (
          <Button
            key={chip}
            variant="primary"
            size="sm"
            onClick={() => onSend(chip)}
            className="normal-case font-medium"
          >
            {chip}
          </Button>
        ))}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        variants={itemVariants}
        className="font-sans text-center flex flex-col items-center gap-2"
      >
        <p style={{ fontSize: 11, color: "#6F6F6F", lineHeight: 1.4 }}>
          {disclaimer}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={onDisclaimer}
          className="font-medium"
        >
          {disclaimerBtn}
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Click cursor SVG ──────────────────────────────────────────────────────────

function ClickIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cursor arrow */}
      <path
        d="M4 3L9 17L11.5 11.5L17 9L4 3Z"
        fill="#E4E5E0"
        stroke="#E4E5E0"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Cursor tail */}
      <path
        d="M11.5 11.5L16 17"
        stroke="#E4E5E0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sparkle lines */}
      <line
        x1="18"
        y1="4"
        x2="18"
        y2="7"
        stroke="#E4E5E0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16.5"
        y1="5.5"
        x2="19.5"
        y2="5.5"
        stroke="#E4E5E0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
