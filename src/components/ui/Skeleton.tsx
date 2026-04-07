import { cn } from "@/lib/utils";
import type React from "react";

// ── Skeleton ──

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-(--muted)", className)}
      style={style}
    />
  );
}
