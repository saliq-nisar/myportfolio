"use client";

import { useEffect, useRef, useState } from "react";
import { useActiveWhileVisible, useTimeouts } from "../hooks";
import { ActionButton, ControlGroup, DemoLayout, FlowNode, Metric, MetricList, Stage, Toggle } from "../primitives";

type Lane = "poll" | "ws";
interface Packet {
  id: number;
  lane: Lane;
  dir: "right" | "left";
  tone: "req" | "data" | "empty";
}

const POLL_MS = 3000;
const AUTO_MS = 4500;
const LATENCY = 400;

export default function RealtimeDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const active = useActiveWhileVisible(rootRef);
  const later = useTimeouts();

  const [auto, setAuto] = useState(true);
  const [server, setServer] = useState(1);
  const [client, setClient] = useState<Record<Lane, number>>({ poll: 1, ws: 1 });
  const [flash, setFlash] = useState<Record<Lane, number>>({ poll: 0, ws: 0 });
  const [packets, setPackets] = useState<Packet[]>([]);
  const [stats, setStats] = useState({ polls: 0, wasted: 0, pollLag: 0, wsLag: 0, pushes: 0 });

  const serverRef = useRef(1);
  const pollClientRef = useRef(1);
  const emittedAt = useRef<Record<number, number>>({});
  const packetId = useRef(0);

  const send = (lane: Lane, dir: Packet["dir"], tone: Packet["tone"]) => {
    const id = ++packetId.current;
    setPackets((p) => [...p, { id, lane, dir, tone }]);
  };
  const drop = (id: number) => setPackets((p) => p.filter((x) => x.id !== id));

  const emit = () => {
    const v = ++serverRef.current;
    emittedAt.current[v] = performance.now();
    setServer(v);
    // WebSocket: server pushes immediately over the open connection.
    send("ws", "left", "data");
    later(() => {
      setClient((c) => ({ ...c, ws: v }));
      setFlash((f) => ({ ...f, ws: f.ws + 1 }));
      setStats((s) => ({ ...s, pushes: s.pushes + 1, wsLag: LATENCY }));
    }, LATENCY);
  };

  const poll = () => {
    send("poll", "right", "req");
    setStats((s) => ({ ...s, polls: s.polls + 1 }));
    later(() => {
      const v = serverRef.current;
      if (v !== pollClientRef.current) {
        pollClientRef.current = v;
        const lag = Math.round(performance.now() - (emittedAt.current[v] ?? performance.now()) + LATENCY);
        send("poll", "left", "data");
        later(() => {
          setClient((c) => ({ ...c, poll: v }));
          setFlash((f) => ({ ...f, poll: f.poll + 1 }));
          setStats((s) => ({ ...s, pollLag: lag }));
        }, LATENCY);
      } else {
        send("poll", "left", "empty");
        setStats((s) => ({ ...s, wasted: s.wasted + 1 }));
      }
    }, LATENCY);
  };

  // Keep latest handlers for the intervals without re-creating them.
  const pollRef = useRef(poll);
  const emitRef = useRef(emit);
  useEffect(() => {
    pollRef.current = poll;
    emitRef.current = emit;
  });

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => pollRef.current(), POLL_MS);
    return () => window.clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (!active || !auto) return;
    const id = window.setInterval(() => emitRef.current(), AUTO_MS);
    return () => window.clearInterval(id);
  }, [active, auto]);

  const lane = (l: Lane, title: string, sub: string) => {
    const stale = client[l] !== server;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-xs text-foreground">{title}</span>
          <span className="font-mono text-[10px] text-muted">{sub}</span>
        </div>
        <div className="grid grid-cols-[76px_1fr_76px] items-center gap-2 sm:grid-cols-[92px_1fr_92px]">
          <FlowNode
            label="Client"
            sub={`v${client[l]}${stale ? " · stale" : ""}`}
            state={stale ? "error" : "done"}
            flashKey={flash[l]}
            className="text-center"
          />
          <div className="relative h-6" aria-hidden>
            <span className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
            {packets
              .filter((p) => p.lane === l)
              .map((p) => (
                <span
                  key={p.id}
                  onAnimationEnd={() => drop(p.id)}
                  className={`absolute inset-y-0 left-0 right-2 ${p.dir === "right" ? "packet-right" : "packet-left"}`}
                >
                  <span
                    className={`absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full ${
                      p.tone === "data" ? "bg-accent" : p.tone === "req" ? "bg-white/60" : "bg-white/20"
                    }`}
                  />
                </span>
              ))}
          </div>
          <FlowNode label="Server" sub={`v${server}`} state="active" className="text-center" />
        </div>
      </div>
    );
  };

  return (
    <div ref={rootRef}>
      <DemoLayout
        visual={
          <Stage label={active ? "Live — same server, two strategies" : "Paused (off-screen)"}>
            <div className="flex flex-col gap-5">
              {lane("poll", "HTTP polling", `GET every ${POLL_MS / 1000}s`)}
              {lane("ws", "WebSocket / Socket.io", "persistent connection, server push")}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Polling asks “anything new?” on a timer — mostly empty answers, and updates arrive late.
              A socket stays open, so the server pushes the change the moment it happens.
            </p>
          </Stage>
        }
        controls={
          <>
            <ActionButton onClick={emit}>Emit server event</ActionButton>
            <ControlGroup label="Simulation">
              <Toggle label="Auto events" hint={`every ${AUTO_MS / 1000}s while visible`} checked={auto} onChange={setAuto} />
            </ControlGroup>
          </>
        }
        metrics={
          <MetricList>
            <Metric label="Poll requests" value={stats.polls} max={Math.max(10, stats.polls)} />
            <Metric label="Empty polls (wasted)" value={stats.wasted} max={Math.max(10, stats.polls)} tone="bad" />
            <Metric label="Polling delay" value={stats.pollLag} max={3500} unit=" ms" tone="bad" />
            <Metric label="Socket delay" value={stats.wsLag} max={3500} unit=" ms" tone="good" />
          </MetricList>
        }
      />
    </div>
  );
}
