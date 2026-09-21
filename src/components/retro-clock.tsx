"use client";

import { useEffect, useState } from "react";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function RetroClock() {
  // Starts null so the server-rendered markup has no clock text to mismatch
  // against the client's first tick.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Both ticks run inside callbacks (never synchronously in the effect
    // body) so mounting doesn't trigger a same-render setState cascade.
    const initial = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, []);

  if (!now) {
    return <div className="font-terminal text-3xl tracking-widest text-[#1f6b3a]">--:--:--</div>;
  }

  const time = now.toLocaleTimeString("vi-VN", { hour12: false });
  const date = `${WEEKDAYS[now.getDay()]}, ${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${now.getFullYear()}`;

  return (
    <div>
      <div className="font-terminal text-3xl tracking-widest text-[#1f6b3a]">{time}</div>
      <div className="font-terminal text-sm tracking-wide text-[#6b5f8a]">{date}</div>
    </div>
  );
}
