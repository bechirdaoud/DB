import { cn } from "@/lib/utils";

type BannerProps = {
  message: string;
  variant?: "info" | "error" | "warning" | "success";
};

export function Banner({ message, variant = "info" }: BannerProps) {
  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        variant === "info" && "border-slate-200 bg-slate-50 text-slate-800",
        variant === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
        variant === "error" && "border-red-200 bg-red-50 text-red-900",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
      )}
    >
      {message}
    </div>
  );
}
