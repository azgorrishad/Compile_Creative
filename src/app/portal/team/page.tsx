import { C } from "@/components/design/Tokens";
import { ArrowRight, Fingerprint } from "lucide-react";

export default function TeamPortal() {
  return (
    <div className="flex min-h-screen items-center justify-center p-5" style={{ background: C.base }}>
      <div className="w-full max-w-md">
        
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(198,165,107,0.1)" }}>
            <Fingerprint className="h-6 w-6" style={{ color: C.gold }} />
          </div>
          <h1 className="font-display text-3xl font-500" style={{ color: C.forest }}>Team Authenticator</h1>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: C.sage }}>
            Compile Creative internal operating system. Authorized personnel only.
          </p>
        </div>

        <form className="space-y-4 rounded-[8px] p-6 sm:p-8 shadow-2xl" style={{ background: C.surface, border: "1px solid rgba(75,99,85,0.1)" }}>
          <div>
            <label className="font-label mb-2 block text-[10px] uppercase tracking-[0.2em]" style={{ color: C.forest }}>SSO Key</label>
            <input 
              type="password" 
              className="w-full rounded-[4px] px-4 py-3 text-[14px] outline-none transition-colors"
              style={{ background: C.base, border: "1px solid rgba(75,99,85,0.2)", color: C.forest }}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="button"
            className="font-label mt-8 flex w-full items-center justify-center gap-2 rounded-[4px] py-4 text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
            style={{ background: C.gold, color: C.forest }}
          >
            Authenticate <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-label text-[9px] uppercase tracking-[0.2em]" style={{ color: C.sage }}>
            IP Logged • Strict Access Control
          </p>
        </div>

      </div>
    </div>
  );
}
