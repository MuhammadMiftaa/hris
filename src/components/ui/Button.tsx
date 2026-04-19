import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileActionVariant = "approve" | "reject" | "neutral";

const VARIANT_STYLES: Record<MobileActionVariant, string> = {
  approve:
    "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400",
  reject: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
  neutral: "bg-(--muted)/50 text-(--muted-foreground) hover:bg-(--muted)",
};

interface MobileActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: MobileActionVariant;
  className?: string;
  disabled?: boolean;
  iconSize?: number;
}

export function MobileActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "neutral",
  className,
  disabled,
  iconSize = 12,
}: MobileActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5",
        "text-xs font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      <Icon size={iconSize} />
      {label}
    </button>
  );
}
