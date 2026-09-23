"use client";

import { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <p className="text-sm font-medium text-zinc-300">{label}</p>
      {children}
      {hint ? <p className="text-xs text-zinc-600">{hint}</p> : null}
    </div>
  );
}
