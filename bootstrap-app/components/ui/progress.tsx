import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  const normalized = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full rounded-full bg-zinc-200", className)}>
      <div
        className="h-full rounded-full bg-zinc-900 transition-all"
        style={{ width: `${normalized}%` }}
      />
    </div>
  );
}
