import { ReactNode } from "react";
import { C } from "./Tokens";

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className="font-label inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em]"
      style={{ color: dark ? C.goldLight : C.sage }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: C.gold }}
      />
      {children}
    </span>
  );
}
